const puppeteer = require("puppeteer");
require("dotenv").config();
const chai = require("chai");
const { server } = require("../app");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

chai.should();

(async () => {
  describe("Functional Tests with Puppeteer", function () {
    let browser, page;

    // set up browser and navigate to page
    before(async function () {
      this.timeout(5000);
      browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        headless: false, // Set to true if you want to run in headless mode
      });
      page = await browser.newPage();
      await page.goto("http://localhost:3000");
    });


    // clean up after tests
    after(async function () {
      this.timeout(5000);
      await browser.close();
      server.close();
      return;
    });

    describe("got to site", function () {
      it("should have completed a connection", function (done) {
        done();
      });

      it("should have correct page title", async function () {
        const pageTitle = await page.title();
        pageTitle.should.equal("Testing with Chai");
      });
    });


    describe("people form", function () {
      this.timeout(5000);

      beforeEach(async function () {
        // reset all the input fields
        await page.$eval("input[name=name]", (el) => (el.value = ""));
        await page.$eval("input[name=age]", (el) => (el.value = ""));
        await page.$eval("input[name=index]", (el) => (el.value = ""));
        await sleep(200);
      });


      // select element and assert that it exists
      it("should have various elements", async function () {
        this.nameField = await page.$("input[name=name]"); 
        this.nameField.should.not.equal(null);
        this.ageField = await page.$("input[name=age]");
        this.ageField.should.not.equal(null);
        this.resultHandle = await page.$("#result");
        this.resultHandle.should.not.equal(null);
        this.addPerson = await page.$("#addPerson");
        this.addPerson.should.not.equal(null);
        this.personIndex = await page.$("input[name=index]");
        this.personIndex.should.not.equal(null);
        this.getPerson = await page.$("#getPerson");
        this.getPerson.should.not.equal(null);
        this.listPeople = await page.$("#listPeople");
        this.listPeople.should.not.equal(null);
      });

      
      

      it("should create a person record given name and age", async function () {
        await this.nameField.type("Fred");
        await this.ageField.type("10");
        await this.addPerson.click();
        await sleep(200);

        // getProperty returns a JSHandle(object representing the property of the element)
        const resultData = await (await this.resultHandle.getProperty("textContent")).jsonValue();
        console.log("at 1, resultData is ", resultData);
        resultData.should.include("A person record was added");
        const { index } = JSON.parse(resultData);
        this.lastIndex = index;
      });


      // try to add one more person with different name but with missing age
      it("should not create a person record without an age", async function () {
        await this.nameField.type("Aleksey");
        // await page.$eval("#age", (el) => (el.value = ""));
        await this.addPerson.click();
        await sleep(200);

        const resultData = await (await this.resultHandle.getProperty("textContent")).jsonValue();
        console.log("at 2, resultData is ", resultData);
        resultData.should.include("Please enter an age");
      });


      // add another person and make sure that count of the returned array is correct
      it("should return the entries just created", async function () {
        await this.nameField.type("Aleksey");
        await this.ageField.type("36");
        await this.addPerson.click();
        await sleep(200);

        let resultData = await (await this.resultHandle.getProperty("textContent")).jsonValue();
        console.log("at 3.1 (add new person), resultData is ", resultData);
        resultData.should.include("A person record was added");
        this.lastIndex = JSON.parse(resultData).index;

        await this.listPeople.click();
        await sleep(200);

        resultData = await (await this.resultHandle.getProperty("textContent")).jsonValue();
        const people = JSON.parse(resultData);
        console.log("at 3.2(list of people) , resultData is ", people);
        people.should.be.an("array");
        people.should.have.lengthOf(this.lastIndex + 1);
      });


      // populate the index field with the last index and click the getPerson button
      it("should return the last entry.", async function () {
        await this.personIndex.type(this.lastIndex.toString());
        await this.getPerson.click();
        await sleep(200);

        const resultData = await (await this.resultHandle.getProperty("textContent")).jsonValue();
        console.log("at 4, resultData is ", resultData)
        const person = JSON.parse(resultData);
        person.should.be.an("object");
        const name = person.name;
        const age = person.age;
        name.should.equal("Aleksey");
        age.should.equal(36);
      });
    });
  });
})();
