class AVLNode {
    constructor(value) {
        this.value = value;
        this.height = 1;
        this.left = null;
        this.right = null;
    }
}
class AVLTree {
    constructor() {
        this.root = null;
    }

    getHeight(node) {
        return node ? node.height : 0;
    }

    getBalanceFactor(node) {
        return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
    }

    rightRotate(y) {
        let x = y.left;
        let T2 = x.right;
        x.right = y;
        y.left = T2;
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
        return x;
    }

    leftRotate(x) {
        let y = x.right;
        let T2 = y.left;
        y.left = x;
        x.right = T2;
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
        return y;
    }

    insert(node, value) {
        if (!node) return new AVLNode(value);

        if (value < node.value) {
            node.left = this.insert(node.left, value);
        } else if (value > node.value) {
            node.right = this.insert(node.right, value);
        } else {
            return node; // Duplicate values not allowed
        }

        node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
        let balance = this.getBalanceFactor(node);

        if (balance > 1 && value < node.left.value) return this.rightRotate(node);
        if (balance < -1 && value > node.right.value) return this.leftRotate(node);
        if (balance > 1 && value > node.left.value) {
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }
        if (balance < -1 && value < node.right.value) {
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    delete(node, value) {
        if (!node) return node;

        if (value < node.value) {
            node.left = this.delete(node.left, value);
        } else if (value > node.value) {
            node.right = this.delete(node.right, value);
        } else {
            if (!node.left || !node.right) {
                node = node.left ? node.left : node.right;
            } else {
                let temp = this.getMinValueNode(node.right);
                node.value = temp.value;
                node.right = this.delete(node.right, temp.value);
            }
        }

        if (!node) return node;

        node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
        let balance = this.getBalanceFactor(node);

        if (balance > 1 && this.getBalanceFactor(node.left) >= 0) return this.rightRotate(node);
        if (balance > 1 && this.getBalanceFactor(node.left) < 0) {
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }
        if (balance < -1 && this.getBalanceFactor(node.right) <= 0) return this.leftRotate(node);
        if (balance < -1 && this.getBalanceFactor(node.right) > 0) {
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    getMinValueNode(node) {
        while (node.left) {
            node = node.left;
        }
        return node;
    }

    add(value) {
        this.root = this.insert(this.root, value);
        this.visualizeTree();
    }

    remove(value) {
        this.root = this.delete(this.root, value);
        this.visualizeTree();
    }

    resetTree() {
        this.root = null;
        this.visualizeTree();
    }

    visualizeTree() {
        let container = document.getElementById("treeContainer");
        container.innerHTML = "";
        this.drawNode(this.root, container, window.innerWidth / 2, 50, 150, null);
    }

    drawNode(node, container, x, y, offset, parent) {
        if (!node) return;

        let div = document.createElement("div");
        div.className = "node";
        div.innerHTML = node.value;
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
        container.appendChild(div);

        if (parent) {
            this.drawEdge(container, parent, div);
        }

        if (node.left) this.drawNode(node.left, container, x - offset, y + 70, offset / 2, div);
        if (node.right) this.drawNode(node.right, container, x + offset, y + 70, offset / 2, div);
    }

    drawEdge(container, parent, child) {
        let edge = document.createElement("div");
        edge.className = "edge";

        let parentX = parseInt(parent.style.left) + parent.offsetWidth / 2;
        let parentY = parseInt(parent.style.top) + parent.offsetHeight / 2;
        let childX = parseInt(child.style.left) + child.offsetWidth / 2;
        let childY = parseInt(child.style.top) + child.offsetHeight / 2;

        const offset = 10;
        let angle = Math.atan2(childY - parentY, childX - parentX);

        parentX += offset * Math.cos(angle);
        parentY += offset * Math.sin(angle);
        childX -= offset * Math.cos(angle);
        childY -= offset * Math.sin(angle);

        let dx = childX - parentX;
        let dy = childY - parentY;
        let length = Math.sqrt(dx * dx + dy * dy);

        edge.style.width = `${length}px`;
        edge.style.transform = `rotate(${angle * (180 / Math.PI)}deg)`;
        edge.style.left = `${parentX}px`;
        edge.style.top = `${parentY}px`;

        container.appendChild(edge);
    }
}

const tree = new AVLTree();
document.getElementById("addButton").addEventListener("click", () => {
    let value = parseInt(document.getElementById("valueInput").value);
    if (!isNaN(value)) tree.add(value);
});
document.getElementById("deleteButton").addEventListener("click", () => {
    let value = parseInt(document.getElementById("valueInput").value);
    if (!isNaN(value)) tree.remove(value);
});
document.getElementById("resetButton").addEventListener("click", () => tree.resetTree());