const express = require('express')
const app = express()
const dic = {'fab': 5}
const cheerio = require("cheerio");
const axios = require("axios");
var fs = require("fs");




app.use((req, res, next) => {
    console.log("req received from client");
    console.log(req.originalUrl);
    const request = req.originalUrl.slice(1);
    if (Object.keys(req.query).length){
        console.log('query')
        const dic = req.query;
        console.log(dic.keywords)
        if (dic.keywords){
            fs.readFile('./keywords.json', (error, data) => {
                if (error) {
                console.error(error);
                return;
                }
                const keywords = JSON.parse(data);
                if(dic.remove === 'true'){
                    if (keywords.keywords.includes(dic.keywords)){
                        keywords.keywords.splice(keywords.keywords.indexOf(dic.keywords),1)
                        fs.writeFile(`keywords.json`, JSON.stringify({"keywords": keywords.keywords}), "utf8", () => {
                            console.log("success!");
                          });
                    }
                }
                else{
                    if (!keywords.keywords.includes(dic.keywords)){
                        keywords.keywords.push(dic.keywords)
                        fs.writeFile(`keywords.json`, JSON.stringify({"keywords": keywords.keywords}), "utf8", () => {
                            console.log("success!");
                            });
                        
                    }
                }
                })
            
        }
       
        if (dic.amazon === 'true'){
            console.log('go fuck yourself');
            runAmazon()
            res.send("success!")
        }
    }
    else{
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        console.log(`${request} files sent!`);
        res.download(`./${request}.json`);
    }

});                 
app.listen(3000, () => console.log('Node.js app listening on port 3000.'))



const numbers = "0123456789,";
var total = 0;
function runAmazon(){
    async function getKeywords(){
        return fs.readFile('./keywords.json' , (error, data) => {
            if (error) {
            console.error(error);
            return;
            }
            for (const b of JSON.parse(data).keywords){
                console.log(b);
                readJSON(b);
            };
            })
      }
    getKeywords();
    }

class Product {
  constructor(json = undefined) {
    this.date = [new Date()];
    if (json) {
      this.date = this.date.map(x => new Date(x));
      this.name = json.name;
      this.price = json.price;
      this.description = json.description;
      this.reviews = json.reviews;
      this.numreviews = json.numreviews;
      this.sales = json.sales;
      this.dataasin = json.dataasin;
      this.href = json.href;
      this.isPrime = json.isPrime;
      this.featurebullets = json.featurebullets;
      this.rank = json.rank;
    }
  }
  getDate() {
    return this.date;
  }
  setDate(date) {
    this.date = date;
  }
  getData() {
    return this.dataasin;
  }
  setData(dataasin) {
    this.dataasin = dataasin;
  }
  getName() {
    return this.name;
  }
  setName(name) {
    this.name = name;
  }
  getPrice() {
    return this.price;
  }
  setPrice(price) {
    this.price = price;
  }
  getDescription() {
    return this.description;
  }
  setDescription(description) {
    this.description = description;
  }
  getReviews() {
    return this.reviews;
  }
  setReviews(review) {
    this.reviews = review;
  }
  getNumReviews() {
    return this.numreviews;
  }
  setNumReviews(numreview) {
    this.numreviews = numreview;
  }
  getSales() {
    return this.sales;
  }
  setSales(sales) {
    this.sales = sales;
  }
  gethref() {
    return this.href;
  }
  sethref(href) {
    this.href = href;
  }
  getPrime() {
    return this.isPrime;
  }
  setPrime(prime) {
    this.isPrime = prime;
  }
  getFeatureBullets() {
    return this.featurebullets;
  }
  setFeatureBullets(featurebullets) {
    this.featurebullets = featurebullets;
  }
  getRank() {
    return this.rank;
  }
  setRank(rank) {
    this.rank = rank;
  }
}

async function performScraping(dict, key) {
  //cookie made myself
  const newKeywords = key.split(" ").join("+");
  console.log(key);
  const axiosResponse = await axios.request({
    method: "GET",
    url: `https://amazon.com/s?k=${newKeywords}`,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/116.0.1938.69",
      Cookie:
        "i18n-prefs=USD; skin=noskin; ubid-main=130-8468536-4259523; session-id=132-8468616-5962418; session-id-time=2082787201l; JSESSIONID=6EC09A3F50FE276C57268A9050D9FE7D; session-token=nctNboqzbAIwt3gCYbGdC/VUPk06Jq6rvCwMdAgSEwuEnl3Jp6sxruR9pZl00y1XPUHjxKsgXxxU1BMIp5rfu1TnUzbevfpc/2yhMBc73j7CdBHJkBKbDJUqm03ivyABCeKZmmXzCkiJHYJjpSTnSR+1i6sM+yXHAFvV4UcfBpFCPf7xte3o/db14gp24ffQoY71BozfLptZbuo055GZ0tPm7oftHTQ7Licq096i7KSO8V1ES5dwLvSF6ndUlWl3Hz7Jg91++0S1OO1Y7F46gvMW1LM0UhMfwHrdjEvXKrDeFHQ9SLtUW61HA6HgzyPe1I6ohmzDZ0mR3PqE6Gur0V10cBqAfmj8; csm-hit=tb:FBN99H9RYFC87YH7DGG6+s-7E27EKKCM189CNGTC36Y|1694097955043&t:1694097955043&adb:adblk_no",
    },
  });
  const $ = cheerio.load(axiosResponse.data);
  const divs = $(".s-main-slot.s-result-list.s-search-results.sg-row");
  //console.log(divs);
  var ranknum = 0;
  divs.children("div").each((index, element) => {
    //console.log(element.attributes);
    if ($(element).attr("data-asin")) {
      const dataasin = $(element).attr("data-asin");
      const name = $(element)
        .find(".a-size-base-plus.a-color-base.a-text-normal")
        .text();

      //getting sales from last month
      var num;
      const numbersbought = $(element).find(".a-size-base.a-color-secondary");
      numbersbought.each((index, b) => {
        string_value = $(b).text();
        if (string_value[0] in numbers.split("")) {
          var j = 0;
          while (string_value[j] in numbers.split("")) {
            j++;
          }
          num = parseInt(string_value.slice(0, j));
          if (string_value[j] == "K") {
            num *= 1000;
          }
          total += num;
        }
      });
      //getting reviews
      var review;
      var numreview;
      const reviews = $(element).find(".a-row.a-size-small").children("span");
      if ($(reviews[0]).attr("aria-label")) {
        review = parseFloat($(reviews[0]).attr("aria-label").slice(0, 3));
      }
      if ($(reviews[1]).attr("aria-label")) {
        numreview = parseInt($(reviews[1]).attr("aria-label").replace(",", ""));
      }
      //getting link to product
      const href =
        "https://amazon.com" +
        $(element).find(".a-link-normal.s-no-outline").attr("href");
      //getting price
      const price =
        parseFloat($(element).find(".a-price-whole").text()) +
        parseFloat("0." + $(element).find(".a-price-fraction").text());
      var prime = false;
      if ($(element).find(".a-icon.a-icon-prime.a-icon-medium").length) {
        prime = true;
      }
      if (dict && dict[dataasin]) {
        if (
          dict[dataasin].getPrice()[dict[dataasin].getPrice().length - 1] ==
            price &&
          dict[dataasin].getName()[dict[dataasin].getName().length - 1] ==
            name &&
          dict[dataasin].getReviews()[
            dict[dataasin].getReviews().length - 1
          ] == review &&
          dict[dataasin].getNumReviews()[
            dict[dataasin].getNumReviews().length - 1
          ] == numreview &&
          dict[dataasin].getSales()[dict[dataasin].getSales().length - 1] ==
            num
        ) {
          //do nothing
          console.log("stayedthesame");
        } else {
          console.log("changed");
          dict[dataasin].getDate().push(new Date());
          dict[dataasin].getPrice().push(price);
          dict[dataasin].getName().push(name);
          dict[dataasin].getReviews().push(review);
          dict[dataasin].getNumReviews().push(numreview);
          dict[dataasin].getSales().push(num);
          dict[dataasin].getRank().push(ranknum);
        }
      } else {
        const product = new Product();
        product.setPrice([price]);
        product.setName([name]);
        product.setReviews([review]);
        product.setNumReviews([numreview]);
        product.setSales([num]);
        product.setData(dataasin);
        product.sethref(href);
        product.setRank([ranknum]);
        dict[dataasin] = product;
      }
      ranknum += 1;
    }
  });

  fs.writeFile(`${key.split(" ").join("")}.json`, JSON.stringify(dict), "utf8", () => {
    console.log("success!");
  });
}

async function scrapeIndividual(ele) {
  const axiosResponse = await axios.request({
    method: "GET",
    url: ele.href,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/116.0.1938.69",
      Cookie:
        "i18n-prefs=USD; skin=noskin; ubid-main=130-8468536-4259523; session-id=132-8468616-5962418; session-id-time=2082787201l; JSESSIONID=6EC09A3F50FE276C57268A9050D9FE7D; session-token=nctNboqzbAIwt3gCYbGdC/VUPk06Jq6rvCwMdAgSEwuEnl3Jp6sxruR9pZl00y1XPUHjxKsgXxxU1BMIp5rfu1TnUzbevfpc/2yhMBc73j7CdBHJkBKbDJUqm03ivyABCeKZmmXzCkiJHYJjpSTnSR+1i6sM+yXHAFvV4UcfBpFCPf7xte3o/db14gp24ffQoY71BozfLptZbuo055GZ0tPm7oftHTQ7Licq096i7KSO8V1ES5dwLvSF6ndUlWl3Hz7Jg91++0S1OO1Y7F46gvMW1LM0UhMfwHrdjEvXKrDeFHQ9SLtUW61HA6HgzyPe1I6ohmzDZ0mR3PqE6Gur0V10cBqAfmj8; csm-hit=tb:FBN99H9RYFC87YH7DGG6+s-7E27EKKCM189CNGTC36Y|1694097955043&t:1694097955043&adb:adblk_no",
    },
  });
  const $ = cheerio.load(axiosResponse.data);
  const featurebullets = $("#feature-bullets");
  ele.setFeatureBullets(featurebullets.text());
  const itemdescription = $("#productDescription");
  ele.setDescription(itemdescription.text());
  console.log("scraped " + ele.getName());
  return true;
}

async function readJSON(key) {
  fs.readFile(`${key.split(" ").join("")}.json`, "utf8", function readFileCallback(err, data) {
    if (err) {
      console.log(err);
      performScraping({}, key);
    } else {
      const obj = JSON.parse(data); //now it an object
      const newArray = {};
      for (const b of Object.keys(obj)) {
        newArray[b] = new Product((json = obj[b]));
      }
      console.log(key);
      performScraping(newArray, key);
    }
  });
}
