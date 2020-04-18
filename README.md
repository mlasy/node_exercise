Why did you pick your particular your design? What assumptions did you make, and what tradeoffs did you consider?

1. i chose to work with mongoose here, since it abstracts away a lot of the mongodb drivers functionallity

2. i decided to keep the execution of the script in a single file and a simple-to-follow sequence.
   This is based on the assumption, that this code is not used elsewhere.
   working on a larger project, a split to different modules with different concerns would be of course more appropriate
   (separating setup, configuration, model and controlling)

3. All queries but the 4th one and the setup/teardown are executed inside the main function.
   This is, because aggregate queries can grow in length and would make the code hard to read

4. i chose to have rather long variable names, using camelCase.
   This is because most of the modern IDEs have autocomplete features when developing.
   I prefer to keep variable declarations names (like databaseUrl) instead of inserting them straight into queries/calls.
   It makes the code more readable in my opinion.

5. I removed all console.logs as it would be the case in any production system.
   however, i kept the comments (1-4) to indicate the single tasks which are being executed.

What is the complexity of your operations (O- notation)?

Since i didnt create an Index for any of the fields but the orderId, the O-notations are

1. O(n)
2. O(n)
3. O(log n)
4. O(n)
