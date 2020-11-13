const axios = require('axios')
const cheerio = require('cheerio')

const getTitle = async (url) => {
    const {data} = await axios.get(url)
    const $ = cheerio.load(data)

    const element = await $('body > main > section > div > ul > li')
    const len = element.length
    
    for(i=1;i<=len;i++){
        //title
        const title = await $(`body > main > section > div > ul > li:nth-child(${i}) > a > md-card > div > h4`).text()
        //link
        const piece = await $(`body > main > section > div > ul > li:nth-child(${i}) > a`).attr('href')
        const link = 'https://summerofcode.withgoogle.com' + piece
        console.log({title, link})
    }
}

getTitle('https://summerofcode.withgoogle.com/archive/2019/organizations/')