module.exports = {
    projects: [
      {
        displayName: "test-file-1",
        testMatch: ["**/__test__/database.test.[jt]s?(x)"],
        testEnvironment: "node"
      },
      {
        displayName: "test-file-2",
        testMatch: ["**/__test__/frontend.test.[jt]s?(x)"],
        testEnvironment: "jsdom"
      },
      {
        displayName: "test-file-3",
        testMatch: ["**/__test__/scoring.test.[jt]s?(x)"],
        testEnvironment: "node"
      }
    ]
  };
  