import {Configuration, OpenAIApi} from "openai";
import {PorterStemmerDe} from "natural";


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function getAnswer(question: string, paragraph: string): Promise<string> {
    const prompt = "Antworte dem Studierenden auf seine Frage basierend auf dem nachfolgenden Paragraphen " +
        "aus der GPO IT. Gib die Quelle für deine Informationen an, indem du den Paragraphen, den Absatz " +
        "und den Satz angibst. Falls der Paragraph nicht die entsprechende Information hat, teile dies " +
        "dem Studierenden mit.\n\n" +
        paragraph +
        "\n\n" +
        "Frage:" + question + "\nAntwort: "

    const completion = await openai.createCompletion({
        max_tokens: 400,
        model: "text-davinci-003",
        prompt,
    });
    return completion.data.choices[0].text.trim();
}