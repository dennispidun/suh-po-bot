import gpo from './data/gpo.json';
import {Configuration, OpenAIApi} from "openai";


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function main(): Promise<void> {
    const parsWithQuestions = gpo.paragraphs.map(p => {
        return {
            ...p,
            questions: ""
        }
    })

    for (let i = 0; i < parsWithQuestions.length; i++) {
        const completion = await openai.createCompletion({
            max_tokens: 300,
            model: "text-curie-001",
            prompt: "Erstelle 3 bis 10 Fragen die man zu folgendem Paragraphen stellen könnte.:\n" +
                "Nummeriere die Fragen nicht. Eine Frage pro Zeile." +
                "\n" +
                parsWithQuestions[i].name + " " + parsWithQuestions[i].keywords,
        });
        parsWithQuestions[i].questions = completion.data.choices[0].text
    }

    console.log(JSON.stringify(parsWithQuestions))
}

main().catch(console.error);