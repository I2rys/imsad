//Requirements Importer
const File_Downloader = require("nodejs-file-downloader")
const Images_Scraper = require("images-scraper")

//Functions
const Scraper = new Images_Scraper({
    puppeteer: {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    }
})

//Main
async function self(directory = String, keyword = String, amount = BigInt, callback){
    var si = keyword
    var image_index = 0
    var images_link = []
    var not_image_index = 0

    if(!directory){
        callback("Invalid directory..")
        return
    }

    if(!keyword){
        callback("Invalid keyword.")
        return
    }

    if(!amount){
        callback("Invalid amount.")
        return
    }

    if(isNaN(amount)){
        callback("Invalid amount is not an int.")
        return
    }

    amount = parseInt(amount)

    const images = await Scraper.scrape(si, amount)

    if(!images){
        callback(`Unable to find any images of ${keyword}`)
        return
    }

    for( image in images ){
        images_link.push(images[image].url)
    }

    if(amount > images_link.length){
        console.log("amount argument exceeded scraped images length, therefore we made amount the same as scraped images length.")
        amount = images_link.length
    }

    Init()
    async function Init(){
        if(image_index == amount){
            image_index -= not_image_index
            callback(`Downloaded images amount: ${image_index} | Downloaded images directory: ${directory}`)
            return
        }

        var downloader = new File_Downloader({
            url: images_link[image_index],
            directory: directory
        })

        try{
            if(images_link[image_index].indexOf("gif") != -1 || images_link[image_index].indexOf("png") != -1 || images_link[image_index].indexOf("jpg") != -1 || images_link[image_index].indexOf("jpeg") != -1  || images_link[image_index].indexOf("raw") != -1 || images_link[image_index].indexOf("tif") != -1 || images_link[image_index].indexOf("tiff") != -1 || images_link[image_index].indexOf("aviff") != -1){
                await downloader.download()

                console.log(`Download status: Success | Download link: ${images_link[image_index]}`)
                image_index += 1
                Init()
                return
            }

            console.log(`Download status: Fail | Download link: ${images_link[image_index]}`)
            not_image_index += 1
            image_index += 1
            Init()
            return
        }catch{
            console.log(`Download status: Fail | Download link: ${images_link[image_index]}`)

            image_index += 1
            Init()
            return
        }
    }
}

//Exporter
module.exports = {
    self: self
}
