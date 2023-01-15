import {Configuration, OpenAIApi} from "openai";
import {PorterStemmerDe} from "natural";


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function getKeywordsGPT(question: string): Promise<string> {
    const prompt = "Extrahiere die wichtigen Worte der Frage und erstelle eine Keyword-Liste. Erstelle Synonyme. Mache es genauso wie in den folgenden Beispielen:\n\n"
        + "Frage: Wie lange kann ich für den Bachelor benötigen?\n"
        + "Antwort: Bachelor, Regelstudienzeit, Dauer, Zeit, Länge\n"
        + "Frage: Welche Konsequenzen hat es bei einer Klausur zu schummeln?\n"
        + "Antwort: Konsequenzen, Klausur, Prüfung, Schummeln, Mogeln, Täuschung, Täuschungsversuch, Unrechtmäßig, Täuschen\n"
        + "Frage: Kann ich auch mit einem Realschulabschluss an der Uni Hildesheim studieren?\n"
        + "Antwort: Hochschulreife, Realschule, Realschulabschluss, Abschluss, Zulassungsvoraussetzungen, Studiumbeginn, Zulassungskriterium\n"
        + "Frage: Wie viele Credits brauche ich für den Bachelor?\n"
        + "Antwort: Credits, Punkte, Kreditpunkte, ECTS, Abschluss, Bachelor\n\nFrage: " + question + "\nAntwort: "

    const completion = await openai.createCompletion({
        max_tokens: 300,
        model: "text-davinci-003",
        prompt,
    });
    return completion.data.choices[0].text.trim();
}

export function getKeywords(question: string): string {
    return ""
}