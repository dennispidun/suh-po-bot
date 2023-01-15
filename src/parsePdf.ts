import {PDFExtract, PDFExtractOptions} from 'pdf.js-extract';
const pdfExtract = new PDFExtract();

interface Paragraph {
    number: number
    name: string;
    content: string;
}

const blockedWords = ["Abs. 4 bis 6", "gilt entsprechend."]

async function parse() {
    const options: PDFExtractOptions = {}; /* see below */
    const data = await pdfExtract.extract('src/pdfs/gpo.pdf', options)
    const paragraphTitlesRaw = data.pages.slice(1).map(page =>
        page.content
            .filter(c => c.height >= 11 && c.x > 120)
            .map(c => {
                let str = c.str;
                if (str.match(/§[0-9]+/)) {
                    str.replace(/§[0-9]+/,"")
                }

                return `${str}`
        }).join("-|-")
    ).join("-|-").split("-|-")

    const all = data.pages
        .slice(1)
        .map(page => page.content.filter(c => !c.str.startsWith("Verkün") && !c.str.startsWith("dungsblatt")).map(c => c.str).join(" "))
        .join(" ")

    let paragraphsTitles: string[] = []

    for (let i = 0; i < paragraphTitlesRaw.length; i++) {
        if (paragraphTitlesRaw[i].match(/^§ [1-9][0-9]?$/)) {
            paragraphsTitles.push(paragraphTitlesRaw[i])
        } else {
            if (i > 0 && paragraphTitlesRaw[i - 1].startsWith("§ ")) {
                paragraphsTitles[paragraphsTitles.length - 1] = `${paragraphsTitles[paragraphsTitles.length - 1]} ${paragraphTitlesRaw[i].trimStart()}`
            }
        }
    }

    let paragraphs: Paragraph[] = []

    for (let i = 0; i < paragraphsTitles.length; i++) {
        const name:string = paragraphsTitles[i];
        let content: string = all.split(name)[1]

        if (i < paragraphsTitles.length - 1) {
            content = content.split(paragraphsTitles[i+1])[0]
        }
        paragraphs.push({
            name,
            number: i+1,
            content: content.trim().replace("- ", "").replace(/[ ]{2,}/, "")
        })
    }

    console.log(paragraphs)
    /*
        § 1Regelungsgegenstand
        § 2Prüfungsordnungen
        § 4Leistungspunktesystem(1)

    const splitted = all.split(/[a-z]/).slice(1)

    let paragraphs: Paragraph[] = []
    for (let i = 0; i < splitted.length/2; i++) {
        const n = Number.parseInt(splitted[i*2].replace(/[^0-9.]/g, ""));

        if (paragraphs.length > 0 && paragraphs[paragraphs.length]) {
            const lastN = paragraphs[paragraphs.length].number;

            if (n != lastN + 1) {
                paragraphs[paragraphs.length].content += splitted[i*2 + 1];
                continue
            }
        }
        paragraphs.push({
            name: splitted[i*2],
            content: splitted[i*2 + 1],
            number: n
        })

    }

    console.log(paragraphs)*/

}

parse().then(() => {})