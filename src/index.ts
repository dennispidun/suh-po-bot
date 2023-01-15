import gpo from './data/gpo.json';
import {BayesClassifier, PorterStemmerDe, WordTokenizer} from 'natural';
import getAnswer from "./getAnswer";

class GPOMemory {
    classifier = new BayesClassifier(PorterStemmerDe);
    tokenizer = new WordTokenizer();

    constructor() {
        this.train()
    }

    private train() {
        gpo.paragraphs.forEach(p => {
            this.classifier.addDocument(p.keywords, p.number.toString());

            if(p && p.content) {
                const tokens = this.tokenizer.tokenize(p.content).join(",");
                if(tokens)
                    this.classifier.addDocument(tokens, p.number.toString());
            }

            if(p && p.questions) {
                const tokens = this.tokenizer.tokenize(p.questions.replace("\n","")).join(",");
                if(tokens)
                    this.classifier.addDocument(tokens, p.number.toString());
            }

        })
        this.classifier.train()
    }

    public getClassifier(): BayesClassifier {
        return this.classifier
    }

}

class GPOQuestion {
    tokenizer = new WordTokenizer();
    memory = new GPOMemory()

    constructor(private question: string) {
    }

    public async ask(): Promise<string> {
        let tokens = ""
        let q = this.question;
        tokens = this.tokenizer.tokenize(q).filter(w => w.length > 3).join(",");
        const parIndex = Number.parseInt(this.memory.getClassifier().classify(tokens))-1
        const parName = gpo.paragraphs[parIndex].name;
        const par = gpo.paragraphs[parIndex].content
        return parName + "\n\n" + await getAnswer(q, parName + "\n" + par);
    }
}

async function main(): Promise<void> {
    const gpoQuestion = new GPOQuestion("Wo finde ich die Beschreibungen für die Module?");
    const gpoQuestion2 = new GPOQuestion("Wie ist der Studiengang Angewandte Informatik aufgebaut?");
    const gpoQuestion3 = new GPOQuestion("Wie oft kann ich eine Prüfung wiederholen? Gibt es einen Freiversuch?");
    console.log(await gpoQuestion.ask())
    console.log(await gpoQuestion2.ask())
    console.log(await gpoQuestion3.ask())
}

main().catch(console.error);