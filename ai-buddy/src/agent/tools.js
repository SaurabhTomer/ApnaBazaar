import {tool} from '@langchain/core/tools'
import z from 'zod'
import axios from 'axios'


export const searchProduct = tool( async ({ query , token }) => {

    const response = await axios.get(`http://localhost:3001/api/products?q=${data.query}`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });

    return JSON.stringify(response.data);



},{
    name:"searchProduct",
    description:"Search for products based on a query",
    inputSchema: z.object({
        query: z.string().describe("The search query for products")
    })
})



export const addProductToCart = tool( async ({ productId , quantity = 1 , token }) => {

    const response = await axios.get(`http://localhost:3002/api/cart/items`,{
        productId,
        quantity
    }
        
        ,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });

    return `Added product with id ${productId} (quantity : ${quantity}) to cart`;



},{
    name:"addProductToCart",
    description:"Add a product to the shopping cart",
    inputSchema: z.object({
        productId: z.string().describe("The id of the product to add to the cart"),
        quantity: z.number().describe("The quantity of the product to add to the cart").default(1),
    })
})

