class CDLLNode {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

class CDLL {
    constructor() {
        this.head = null;
    }

    insertAtEnd(value) {
        const newNode = new CDLLNode(value);

        if (!this.head) {
            newNode.next = newNode;
            newNode.prev = newNode;
            this.head = newNode;
        } else {
            let tail = this.head.prev;

            tail.next = newNode;
            newNode.prev = tail;
            newNode.next = this.head;
            this.head.prev = newNode;
        }
        this.visualize();
    }

    deleteByValue(value) {
        if (!this.head) return;

        let current = this.head;
        do {
            if (current.value === value) {
                if (current.next === current) {
                    this.head = null;
                } else {
                    current.prev.next = current.next;
                    current.next.prev = current.prev;
                    if (current === this.head) {
                        this.head = current.next;
                    }
                }
                this.visualize();
                return;
            }
            current = current.next;
        } while (current !== this.head);
    }

    reverse() {
        if (!this.head) return;

        let current = this.head;
        do {
            let temp = current.next;
            current.next = current.prev;
            current.prev = temp;
            current = temp;
        } while (current !== this.head);

        // after reversing, move head to previous tail
        this.head = this.head.prev;
        this.visualize();
    }

    search(value) {
        if (!this.head) return false;

        let current = this.head;
        do {
            if (current.value === value) return true;
            current = current.next;
        } while (current !== this.head);

        return false;
    }

    reset() {
        this.head = null;
        this.visualize();
        document.getElementById("traversalResult").innerText = "";
    }

    visualize() {
        const container = document.getElementById("treeContainer");
        container.innerHTML = "";

        if (!this.head) return;

        let current = this.head;
        const centerX = window.innerWidth / 2;
        const centerY = 250;
        const radius = 200;
        let nodes = [];

        do {
            nodes.push(current);
            current = current.next;
        } while (current !== this.head);

        const totalNodes = nodes.length;
        nodes.forEach((node, index) => {
            const angle = (2 * Math.PI * index) / totalNodes;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            let div = document.createElement("div");
            div.className = "node";
            div.innerHTML = node.value;
            div.style.left = `${x}px`;
            div.style.top = `${y}px`;
            container.appendChild(div);

            node.divRef = div;
        });

        // Draw edges
        for (let i = 0; i < nodes.length; i++) {
            const from = nodes[i];
            const to = nodes[(i + 1) % nodes.length];
            this.drawEdge(container, from.divRef, to.divRef);
        }
    }

    drawEdge(container, fromDiv, toDiv) {
        let edge = document.createElement("div");
        edge.className = "edge";

        let fromX = parseInt(fromDiv.style.left) + fromDiv.offsetWidth / 2;
        let fromY = parseInt(fromDiv.style.top) + fromDiv.offsetHeight / 2;
        let toX = parseInt(toDiv.style.left) + toDiv.offsetWidth / 2;
        let toY = parseInt(toDiv.style.top) + toDiv.offsetHeight / 2;

        const offset = 10;
        let angle = Math.atan2(toY - fromY, toX - fromX);

        fromX += offset * Math.cos(angle);
        fromY += offset * Math.sin(angle);
        toX -= offset * Math.cos(angle);
        toY -= offset * Math.sin(angle);

        let dx = toX - fromX;
        let dy = toY - fromY;
        let length = Math.sqrt(dx * dx + dy * dy);

        edge.style.width = `${length}px`;
        edge.style.transform = `rotate(${angle * (180 / Math.PI)}deg)`;
        edge.style.left = `${fromX}px`;
        edge.style.top = `${fromY}px`;

        container.appendChild(edge);
    }
}

const cdll = new CDLL();

// UI button handlers
document.getElementById("addButton").addEventListener("click", () => {
    let value = parseInt(document.getElementById("valueInput").value);
    if (!isNaN(value)) cdll.insertAtEnd(value);
});

document.getElementById("deleteButton").addEventListener("click", () => {
    let value = parseInt(document.getElementById("valueInput").value);
    if (!isNaN(value)) cdll.deleteByValue(value);
});

document.getElementById("resetButton").addEventListener("click", () => cdll.reset());

document.getElementById("reverseButton").addEventListener("click", () => cdll.reverse());

document.getElementById("searchButton").addEventListener("click", () => {
    let value = parseInt(prompt("Enter value to search:"));
    if (!isNaN(value)) {
        const found = cdll.search(value);
        document.getElementById("traversalResult").innerText = found ? `Value ${value} found! ✅` : `Value ${value} not found. ❌`;
    }
});
