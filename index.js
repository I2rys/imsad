"use strict";

// Dependencies
const fileDownloader = require("nodejs-file-downloader")
const imagesScraper = require("images-scraper")

// Functions
const scraper = new imagesScraper({
    puppeteer: {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    }
})

// Main
async function imsad(directory, keyword, amount, callback){
    var si = keyword
    var imageIndex = 0
    var imagesLink = []
    var notImageIndex = 0

    if(!directory) return callback("Invalid directory..")
    if(!keyword) return callback("Invalid keyword.")
    if(!amount) return callback("Invalid amount.")
    if(isNaN(amount)) return callback("Invalid amount is not an int.")

    amount = parseInt(amount)

    const images = await scraper.scrape(si, amount)

    if(!images){
        callback(`Unable to find any images of ${keyword}`)
        return
    }

    for( const image of images ) imagesLink.push(image.url)

    if(amount > imagesLink.length){
        console.log("amount argument exceeded scraped images length, therefore we made amount the same as scraped images length.")
        amount = imagesLink.length
    }

    scrape()
    async function scrape(){
        if(imageIndex == amount){
            imageIndex -= notImageIndex
            callback(`Downloaded images amount: ${imageIndex} | Downloaded images directory: ${directory}`)
            return
        }

        var downloader = new fileDownloader({
            url: imagesLink[imageIndex],
            directory: directory
        })

        try{
            if(imagesLink[imageIndex].indexOf("gif") != -1 || imagesLink[imageIndex].indexOf("png") != -1 || imagesLink[imageIndex].indexOf("jpg") != -1 || imagesLink[imageIndex].indexOf("jpeg") != -1  || imagesLink[imageIndex].indexOf("raw") != -1 || imagesLink[imageIndex].indexOf("tif") != -1 || imagesLink[imageIndex].indexOf("tiff") != -1 || imagesLink[imageIndex].indexOf("aviff") != -1){
                await downloader.download()

                console.log(`Download status: Success | Download link: ${imagesLink[imageIndex]}`)
                imageIndex++
                return scrape()
            }

            console.log(`Download status: Fail | Download link: ${imagesLink[imageIndex]}`)
            notImageIndex++
            imageIndex++
        }catch{
            console.log(`Download status: Fail | Download link: ${imagesLink[imageIndex]}`)

            imageIndex++
        }

        scrape()
    }
}

module.exports = imsad