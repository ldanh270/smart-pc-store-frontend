import { BackendProduct, Product, mapBackendProduct } from "@/types/product"

import axios from "axios"

const aiApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AI_ASSISTANT_URL,
})

interface AIChatApiResponse {
  id: string
  message: {
    role: "assistant"
    content: string
  }
  suggested_products: BackendProduct[]
  past: null
  future: null
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface AIChatResult {
  answer: string
  products: Product[]
}

export interface PricePoint {
  date: string
  price: number
}

export interface ForecastResult {
  past: PricePoint[]
  future: PricePoint[]
  note?: string
}

export const aiChatService = {
  sendMessage: async (message: string): Promise<AIChatResult> => {
    const response = await aiApi.post<AIChatApiResponse>("/chat", {
      messages: [{ role: "user", content: message }],
    })
    console.log(response.data)
    return {
      answer: response.data.message.content,
      products: (response.data.suggested_products || []).map(mapBackendProduct),
    }
  },

  forecastPrice: async (productId: string, days: number): Promise<ForecastResult> => {
    const response = await aiApi.post<ForecastResult>("/forecast", {
      product_id: productId,
      days,
    })
    return response.data
  },
}
