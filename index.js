const axios = require('axios')
const cheerio = require('cheerio')
const fsp = require('fs').promises;
const path = require('path')

// // Code for scraping orgs from archives of 2016-to-2019

// // Function to get list of orgs from 2k16 to 2k19
// const getList2k16_19 = async () => {
//     for(var k=16; k<=19; k++){
//         const list = []

//         const {data} = await axios.get(`https://summerofcode.withgoogle.com/archive/20${k}/organizations/`)
//         const $ = cheerio.load(data)

//         const element = await $('body > main > section > div > ul > li')
//         const len = element.length
        
//         for(i=1;i<=len;i++){
//             //title
//             const title = await $(`body > main > section > div > ul > li:nth-child(${i}) > a > md-card > div > h4`).text()
//             //link
//             const piece = await $(`body > main > section > div > ul > li:nth-child(${i}) > a`).attr('href')
//             const link = 'https://summerofcode.withgoogle.com' + piece

//             //get orgs techs
//             const {data} = await axios.get(link)
//             const nP = cheerio.load(data)
            
//             const el = await nP('div[class="org__meta"] > div:nth-child(4) > ul > li')
//             const len2 = el.length
//             const list2 = []
//             list.push({title, link})
//             for (var j=1; j<=len2; j++){
//                 const el2 = await nP(`div[class="org__meta"] > div:nth-child(4) > ul > li:nth-child(${j})`)
//                 const txt = await el2.text()
//                 list2.push(txt)
//             }
//             list[i-1].techStack = list2
//             console.log(list[i-1])
//         }
//         let fileData = await fsp.readFile(path.resolve(__dirname, 'orgs.json'));
//         let obj = JSON.parse(fileData);
//         obj[`list20${k}`] = list
//         await fsp.writeFile(path.resolve(__dirname, 'orgs.json'), JSON.stringify(obj));
//     }
// }

// getList2k16_19()

// Code for scraping orgs from archives of 2016-to-2019

// Function to get list of orgs from 2k16 to 2k19
const getList2k16_19 = async () => {
    for (var k = 19; k <= 19; k++) {
        const list = []

        const { data } = await axios.get(`https://summerofcode.withgoogle.com/archive/20${k}/organizations/`)
        const $ = cheerio.load(data)

        const element = await $('body > main > section > div > ul > li')
        const len = element.length
        //console.log(element)

        for (i = 1; i <= len;i++) {
            //title
            const title = await $(`body > main > section > div > ul > li:nth-child(${i}) > a > md-card > div > h4`).text()
            //link
            const piece = await $(`body > main > section > div > ul > li:nth-child(${i}) > a`).attr('href')
            const link = 'https://summerofcode.withgoogle.com' + piece
            var orgLogo = await $(`body > main > section > div > ul > li:nth-child(${i}) > a > md-card > org-logo`).attr('data')
            //console.log(orgLogo)
            orgLogo = orgLogo.slice(16,orgLogo.length)
            var orgLogoUrl = '';
            for(let o = 0; o <= orgLogo.length;o++){
                if(orgLogo[o] === "'"){
                    break
                }
                else{
                    orgLogoUrl = orgLogoUrl + orgLogo[o]
                }
            }
            // console.log(orgLogoUrl)
            //get orgs techs
            const { data } = await axios.get(link)
            const nP = cheerio.load(data)
            //console.log(nP);

            //get orgs Link
            const orgLink = await nP('a[class="org__link"]').attr('href')
            
            //get orgIdeaLink
            //const orgIdeaLink = await nP('a[class="md-button md-soc-theme md-ink-ripple"]').attr('href')

            const el = await nP('div[class="org__meta"] > div:nth-child(4) > ul > li')
            const len2 = el.length
            //console.log(el.length);

            //get Organisations Projects

            const projectSelector = await nP('section[id="projects"] > div > ul > li')
            const projectLength = projectSelector.length

            const projects = []
            for (var l = 1; l <= projectLength; l++) {
                const projecTitle = await nP(`section[id="projects"] > div > ul > li:nth-child(${l}) > md-card > div:nth-child(1) > div`)
                const projectTitleText = await projecTitle.text()

                const projecLink = await nP(`section[id="projects"] > div > ul > li:nth-child(${l}) > md-card > div:nth-child(1) > h5 > a`).attr('href')
                const projectLinkText = 'https://summerofcode.withgoogle.com' + projecLink

                const { data } = await axios.get(projectLinkText)
                const nP2 = cheerio.load(data)

                const projectContent = await nP2('div[class="org__long-description"] > p')
                const projectContentText = await projectContent.text()

                const projectCode = await nP2('div[class="org__meta"] > div:nth-child(1) > a').attr('href')

                const project = {
                    title: projectTitleText,
                    projectLink: projectLinkText,
                    content: projectContentText,
                    projectCode: projectCode
                }

                projects.push(project)
            }

            const list2 = []
            list.push({ title, orgLink, projects, orgLogoUrl })
            for (var j = 1; j <= len2; j++) {
                const el2 = await nP(`div[class="org__meta"] > div:nth-child(4) > ul > li:nth-child(${j})`)
                const txt = await el2.text()
                list2.push(txt)
            }
            list[i - 1].techStack = list2
            console.log(list[i - 1])
        }
        let fileData = await fsp.readFile(path.resolve(__dirname, 'orgs19.json'));
        let obj = JSON.parse(fileData);
        obj[`list20${k}`] = list
        await fsp.writeFile(path.resolve(__dirname, 'orgs19.json'), JSON.stringify(obj));
    }
}

getList2k16_19()


// Code for scraping orgs from archives of 2009-to-2015

// Function to get list of orgs from 2k09 to 2k15
const getList2k09_15 = async () => {
    for(var k=9;k<=15;k++){
        const list = []
        let elData
        if(k==9){
            const {data} = await axios.get(`https://www.google-melange.com/archive/gsoc/200${k}`)
            elData = data
        } else{
            const {data} = await axios.get(`https://www.google-melange.com/archive/gsoc/20${k}`)
            elData = data
        }
        const $ = cheerio.load(elData)

        const element = await $('div.main > ul.mdl-list > li')
        const len = element.length
        
        for(i=1;i<=len;i++){
            //title
            const title = await $(`div.main > ul.mdl-list > li:nth-child(${i}) > span > a`).text()
            //link
            const piece = await $(`div.main > ul.mdl-list > li:nth-child(${i}) > span > a`).attr('href')
            const link = 'https://www.google-melange.com' + piece

            await list.push({title, link})
            console.log(list[i-1])
        }
        let fileData = await fsp.readFile(path.resolve(__dirname, 'orgs.json'));
        let obj = JSON.parse(fileData);
        if(k==9){
            obj[`list200${k}`] = list
        }else{
            obj[`list20${k}`] = list
        }
        await fsp.writeFile(path.resolve(__dirname, 'orgs.json'), JSON.stringify(obj));
    }
}

// getList2k09_15()