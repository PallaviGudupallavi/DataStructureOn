class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let current = this.root;
        for (const char of word) {
            if (!current.children[char]) {
                current.children[char] = new TrieNode();
            }
            current = current.children[char];
        }
        if (current.isEndOfWord) {
            return false; 
        } else {
            current.isEndOfWord = true;
            return true;
        }
    }

    search(word) {
        let current = this.root;
        for (const char of word) {
            if (!current.children[char]) {
                return false;
            }
            current = current.children[char];
        }
        return current.isEndOfWord;
    }

    startsWith(prefix) {
        let current = this.root;
        for (const char of prefix) {
            if (!current.children[char]) {
                return false;
            }
            current = current.children[char];
        }
        return true;
    }
}

const trie = new Trie();
let score = 0;
const trieRepresentation = document.getElementById("trieRepresentation");
const messageElement = document.getElementById("message");
const wordInput = document.getElementById("wordInput");
const scoreElement = document.getElementById("score");

function updateScore(points) {
    score += points;
    scoreElement.textContent = `Score: ${score}`;
}

function visualizeTrie() {
    trieRepresentation.innerHTML = "";
    function traverse(node, parentElement) {
        for (const [char, childNode] of Object.entries(node.children)) {
            const nodeElement = document.createElement("div");
            nodeElement.classList.add("node");
            nodeElement.textContent = char;

            if (childNode.isEndOfWord) {
                nodeElement.classList.add("inserted");
            }

            trieRepresentation.appendChild(nodeElement);
            traverse(childNode, nodeElement);
        }
    }
    traverse(trie.root, trieRepresentation);
}

function insertWord() {
    const word = wordInput.value.trim();
    if (word) {
        const isNewWord = trie.insert(word);
        if (isNewWord) {
            messageElement.textContent = `Inserted: ${word}`;
            updateScore(10);
            visualizeTrie();
        } else {
            messageElement.textContent = `Word already exists: ${word}`;
        }
        wordInput.value = "";
    } else {
        messageElement.textContent = "Please enter a word.";
    }
}

function searchWord() {
    const word = wordInput.value.trim();
    if (word) {
        const found = trie.search(word);
        messageElement.textContent = found
            ? `Word Found: ${word}`
            : `Word Not Found: ${word}`;
        if (found) updateScore(5);
    } else {
        messageElement.textContent = "Please enter a word.";
    }
}

function checkPrefix() {
    const prefix = wordInput.value.trim();
    if (prefix) {
        const found = trie.startsWith(prefix);
        messageElement.textContent = found
            ? `Prefix Found: ${prefix}`
            : `Prefix Not Found: ${prefix}`;
        if (found) updateScore(2);
    } else {
        messageElement.textContent = "Please enter a prefix.";
    }
}

function resetTrie() {
    trie.root = new TrieNode();
    trieRepresentation.innerHTML = "";
    messageElement.textContent = "Trie reset successfully!";
    score = 0;
    updateScore(0);
}

document.getElementById("insert-button").addEventListener("click", insertWord);
document.getElementById("search-button").addEventListener("click", searchWord);
document.getElementById("prefix-button").addEventListener("click", checkPrefix);
document.getElementById("reset-button").addEventListener("click", resetTrie);
