## Running Tests 
 
 Automated tests ensure that changes to the code do not introduce new bugs, increasing the reliability of the software.
   
 Tests ensure that every change is tested before being merged and deployed.

### Running Tests After Cloning the Repository

If you have cloned the repository and wish to run the tests, follow these steps:

1. **Install Dependencies**:
   Ensure you have Node.js installed. Navigate to the root directory of the project and run:
   ```bash
   yarn install
   ```
   This command installs all the necessary dependencies for the project, including testing libraries.

2. **Run Tests**:
   Once dependencies are installed, you can run the tests using the following command:
   ```bash
   yarn test
   ```
   This will execute the test suite and provide feedback on the success or failure of the tests.

3. **View Test Results**:
   The test runner will display the results in the terminal, indicating which tests passed or failed. You can review these results to understand any issues or verify that all tests are passing.

4. **Debugging Tests**:
   If a test fails, you can debug it by inspecting the test files located in the `tests` or `__tests__` directory. Ensure that your code changes align with the expected outcomes defined in the tests.

5. **Continuous Testing**:
   For ongoing development, you can use:
   ```bash
   yarn run test:watch
   ```
   This will run the tests in watch mode, automatically re-running tests when files change, providing immediate feedback as you develop.

