import { Configuration, OpenAIApi } from "openai"
import prisma from "./prisma"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export async function getRecommendations(userId: string) {
  // Récupérer l'historique des événements de l'utilisateur
  const userEvents = await prisma.ticket.findMany({
    where: { userId },
    include: { event: true },
  })

  const eventHistory = userEvents.map((ticket) => ticket.event.name).join(", ")

  // Utiliser l'API GPT-3 pour générer des recommandations
  const prompt = `Basé sur l'historique des événements suivants : ${eventHistory}, suggérez 5 types d'événements que cet utilisateur pourrait apprécier.`

  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt,
    max_tokens: 100,
  })

  const recommendations = response.data.choices[0].text?.split("\n").filter(Boolean) || []

  return recommendations
}

