"use strict";
/* global NodeBuilder */ // For ESLint

const test = require("/test/test-helper.xqy");
const {transformGraphqlIntoOpticPlan, executeOpticPlan} = require("/mlGraphqlLibOpticApi");
const {deepEqual} = require("/testHelpers");
const assertions = [];

const rawExpectedResult = {"data":{"Humans":[{"id":1, "name":"John", "height":70, "C":[{"model":"Accord", "year":"2013"}]}, {"id":2, "name":"Jim", "height":75, "C":[]}, {"id":3, "name":"Joe", "height":80, "C":[]}, {"id":1000, "name":"Jane", "height":65, "C":[{"model":"Sonata", "year":"2017"}, {"model":"Camry", "year":"2015"}]}, {"id":1001, "name":"Jenny", "height":65, "C":[]}, {"id":1002, "name":"Joan", "height":65, "C":[]}]}};
const nb = new NodeBuilder();
nb.addNode(rawExpectedResult);
const expectedResults = nb.toNode();

// Given a query with a single join and the child view has an alias
const graphQlJoinWithAliasQueryString = "query humansCarsJoin { Humans { id name height C: Cars { ownerId @childJoinColumn id @parentJoinColumn model year } } }";

// When parse and execute are called
let response = transformGraphqlIntoOpticPlan(graphQlJoinWithAliasQueryString);
console.log("opticPlan:\n" + response.opticPlan.export());
let actualResult = executeOpticPlan(response.opticPlan);

// Then the result set of the Optic query is what is expected.
console.log("Expected Result=>\n" + expectedResults);
console.log("Actual Result=>\n" + actualResult);
assertions.push(
    test.assertTrue(deepEqual(expectedResults, actualResult),
        "The resulting data set does not match the expected results.")
);

assertions;