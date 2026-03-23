import { PrismaClient } from "../src/generated/prisma";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const url = process.env.TURSO_DATABASE_URL || "file:./prisma/dev.db";
const authToken = process.env.TURSO_AUTH_TOKEN;
const adapter = new PrismaLibSql({ url, authToken });
const prisma = new PrismaClient({ adapter });

const descriptions: Record<string, string> = {
  "relax-celog-tela":
    "Blaga i opuštajuća masaža koja smanjuje napetost u telu, poboljšava cirkulaciju i pruža osećaj potpunog odmora.",
  "antistres-masaza":
    "Fokusirana na oslobađanje stresa i mentalne napetosti, uz sporije i umirujuće pokrete koji podstiču relaksaciju i bolje raspoloženje.",
  "terapijska-masaza":
    "Ciljana masaža koja pomaže kod bolova u mišićima, leđima i vratu, kao i kod povreda i hronične napetosti.",
  "limfna-drenaza":
    "Nežna tehnika koja podstiče cirkulaciju limfe, smanjuje otoke, izbacuje toksine i jača imunitet.",
  "rucna-anticelulit-masaza":
    "Intenzivnija masaža koja razbija masne naslage, poboljšava cirkulaciju i pomaže u smanjenju celulita.",
  "masaza-cupping":
    "Tehnika pomoću vakuum čašica koja poboljšava cirkulaciju, opušta mišiće i pomaže kod bolova i detoksikacije.",
  "masaza-trudnica":
    "Posebno prilagođena masaža za trudnice koja ublažava bolove u leđima, smanjuje otoke i pruža relaksaciju uz bezbedne tehnike.",
  "mfr-tretman":
    "Specijalna tehnika koja deluje na fasciju (vezivno tkivo oko mišića), oslobađa duboku napetost, smanjuje bol i poboljšava pokretljivost tela kroz spore i precizne pokrete.",
  "lifting-masaza-lica":
    "Prirodna metoda za zatezanje kože lica, poboljšanje tonusa i smanjenje bora, uz stimulaciju cirkulacije i regeneracije kože.",
  "dermapen":
    "Tretman mikroiglicama koji stimuliše prirodnu regeneraciju kože, podstiče proizvodnju kolagena i pomaže kod bora, ožiljaka i hiperpigmentacije.",
  "mezoporacija":
    "Neinvazivna metoda kojom se aktivni sastojci (vitamini, hijaluron) unose duboko u kožu bez igala, za hidrataciju, podmlađivanje i osvežen izgled.",
  "maderoterapija":
    "Masaža specijalnim drvenim alatima koja poboljšava cirkulaciju, oblikuje telo, smanjuje celulit i podstiče limfnu drenažu.",
  "radionice-telesne-svesnosti-susreti-kod-olje":
    "Radeći u maloj grupi, upoznajemo sve delove sebe, prihvatamo ih i dajemo sebi prostor da budemo autentični. Učimo da primetimo senzacije u telu (stezanje u stomaku, pritisak u grudima, napetost u vratu) i da razumemo kada i zašto se javljaju i šta da uradimo da bi se vratili u dobro, opušteno stanje tela i psihe. Vežbamo samoregulaciju nervnog sistema po principima Somatic experiencinga Pitera Levina. Takođe, dostupan je i rad 1:1 po istoj metodi.",
};

async function main() {
  for (const [slug, description] of Object.entries(descriptions)) {
    const result = await prisma.service.updateMany({
      where: { slug },
      data: { description },
    });
    if (result.count > 0) {
      console.log(`Updated: ${slug}`);
    } else {
      console.log(`NOT FOUND: ${slug}`);
    }
  }

  // Show all current slugs for reference
  const all = await prisma.service.findMany({ select: { slug: true, name: true } });
  console.log("\nAll services in DB:");
  all.forEach((s) => console.log(`  ${s.slug} -> ${s.name}`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
