module.exports = [
  { name: "Details open", path: "/test" },
  { name: "Details closed", path: "/test", actions: [{ $: "summary" }] }
];
