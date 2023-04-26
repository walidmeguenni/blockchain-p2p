# Wmcoin Blockchain
Wmcoin is a simple blockchain implementation built in JavaScript. It allows you to create transactions, add them to blocks, and mine new blocks to secure the blockchain.
## Installation
To get started with Wmcoin, you will need to have Node.js and npm installed on your machine. You can download Node.js from [here](https://nodejs.org/en/).


To install Wmcoin, clone the repository to your local machine:

```git clone https://github.com/walidmeguenni/blockchain-p2p.git```

Then, navigate to the project directory and install the required dependencies:

 ```cd blockchain-p2p ```

 ```npm install```

 ## Usage 

 To start using Wmcoin, you can run the blockchain server by executing:

```npm run start```

This will start the server at http://localhost:3001. You can access the blockchain API using a web browser or a tool like Postman.

## API Endpoints
The following endpoints are available in the Wmcoin API:

* GET /chain: Retrieves the current blockchain
* POST /transactions/new: Adds a new transaction to the blockchain
* POST /mine: Mines a new block and adds it to the blockchain

## Example Usage

To mine a new block, you can make a POST request to http://localhost:3001/mine.

## Contributing
Contributions to Wmcoin are welcome! If you have a bug to report or a feature to suggest, please open an issue on the GitHub repository.

If you would like to contribute code to Wmcoin, please fork the repository and submit a pull request with your changes.
## License
Wmcoin is licensed under the MIT License.









