//Add your tests here
const fs = require("fs");
const controller = require('./geektrust');
var expect = require('chai').expect;
var assert = chai.assert;
//const filenameData = fs.readFileSync('./sample_input/input1.txt', "utf8");
const filenameData = fs.readFileSync(`${process.argv[2]}`).toString()
var data = filenameData.toString().split("\n")

const response = controller.main(data).toString()


describe(`#main()`, function () {

    function iThrowError() {
        throw new Error("Error thrown");
    }
    describe('The app', function() {
        describe('this feature', function() {
            it("is a function", function(){
                assert.throw(iThrowError(), Error, "Error thrown");
            });
        });
    });

    context('response should be an array', function () {
        it('should return array', function () {
            expect(response).to.be.an('string')
        })
    })
    context('response should not be undefined', function () {
        it('responsew not be undefined', function () {
            expect(response).to.not.be.undefined
        })
    })


})