const fsp = require('fs').promises;
const path = require('path')

// Count the no of appearance of orgs in GSOC
const getArrayofTitle = async() => {
    const list = []
    let fileData = await fsp.readFile(path.resolve(__dirname, 'orgs2.json'))
    let obj = JSON.parse(fileData)
    const listYears = [
        'list2009',
        'list2010',
        'list2011',
        'list2012',
        'list2013',
        'list2014',
        'list2015',
        'list2016',
        'list2017',
        'list2018',
        'list2019'
    ]
    listYears.forEach( listYear => {
        let len = obj[`${listYear}`].length
        for(let i=0; i<len; i++){
            list.push({
                title: obj[`${listYear}`][i].title,
                year: listYear.substring(4,)
            })
        }
    })

    function compare(a,b) {
        if(a.title < b.title){
            return -1
        } else if(a.title > b.title){
            return 1
        }
        return 0
    }
    list.sort( compare )
    let len = list.length
    let match = list[0].title.trim().split(' ').join('').toLowerCase()
    let year = list[0].year
    let count = 1
    const ob = {}
    var yrList = [year]
    for(let i=1;i<len;i++){
        let str = list[i].title.trim().split(' ').join('').toLowerCase()
        let yr = list[i].year
        if(str === match){
            count++
            yrList.push(yr)
        } else{
            ob[`${match}`] = {
                count,
                yrList: yrList
            }
            match = str
            count = 1
            yrList= [yr]
        }
    }
    listYears.forEach(listYear => {
        let len = obj[`${listYear}`].length
        for(var i=0 ;i<len;i++){
            let titleTrim = obj[`${listYear}`][i].title.trim().split(' ').join('').toLowerCase()
            if(ob[titleTrim] != null){
                obj[`${listYear}`][i][`noOfTimes`] = ob[titleTrim].count
                obj[`${listYear}`][i][`yrList`] = ob[titleTrim].yrList
            }
        }
    })
    console.log(obj)
    await fsp.writeFile(path.resolve(__dirname, 'orgs2.json'), JSON.stringify(obj));
}

getArrayofTitle()