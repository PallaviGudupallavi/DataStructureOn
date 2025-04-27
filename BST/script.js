class BSTNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }

    insert(node, value) {
        if (!node) return new BSTNode(value);

        if (value < node.value) {
            node.left = this.insert(node.left, value);
        } else if (value > node.value) {
            node.right = this.insert(node.right, value);
        }

        return node;
    }

    delete(node, value) {
        if (!node) return null;

        if (value < node.value) {
            node.left = this.delete(node.left, value);
        } else if (value > node.value) {
            node.right = this.delete(node.right, value);
        } else {
            if (!node.left) return node.right;
            if (!node.right) return node.left;

            let temp = this.getMinNode(node.right);
            node.value = temp.value;
            node.right = this.delete(node.right, temp.value);
        }
        return node;
    }

    getMinNode(node) {
        while (node.left) node = node.left;
        return node;
    }

    inorderTraversal(node, result = []) {
        if (node) {
            this.inorderTraversal(node.left, result);
            result.push(node.value);
            this.inorderTraversal(node.right, result);
        }
        return result;
    }

    preorderTraversal(node, result = []) {
        if (node) {
            result.push(node.value);
            this.preorderTraversal(node.left, result);
            this.preorderTraversal(node.right, result);
        }
        return result;
    }

    postorderTraversal(node, result = []) {
        if (node) {
            this.postorderTraversal(node.left, result);
            this.postorderTraversal(node.right, result);
            result.push(node.value);
        }
        return result;
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
        document.getElementById("traversalResult").innerText = "";
    }

    visualizeTree() {
        let container = document.getElementById("treeContainer");
        container.innerHTML = "";
        if (this.root)
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
    
        // Increase vertical spacing (from 70px to 100px)
        const verticalSpacing = 100;
        // Decrease offset slowly (from offset/2 to offset/1.5)
        if (node.left) this.drawNode(node.left, container, x - offset, y + verticalSpacing, offset / 1.5, div);
        if (node.right) this.drawNode(node.right, container, x + offset, y + verticalSpacing, offset / 1.5, div);
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

const bst = new BST();

document.getElementById("addButton").addEventListener("click", () => {
    let value = parseInt(document.getElementById("valueInput").value);
    if (!isNaN(value)) bst.add(value);
});

document.getElementById("deleteButton").addEventListener("click", () => {
    let value = parseInt(document.getElementById("valueInput").value);
    if (!isNaN(value)) bst.remove(value);
});

document.getElementById("resetButton").addEventListener("click", () => bst.resetTree());

document.getElementById("inorderButton").addEventListener("click", () => {
    const result = bst.inorderTraversal(bst.root).join(" → ");
    document.getElementById("traversalResult").innerText = `Inorder: ${result}`;
});

document.getElementById("preorderButton").addEventListener("click", () => {
    const result = bst.preorderTraversal(bst.root).join(" → ");
    document.getElementById("traversalResult").innerText = `Preorder: ${result}`;
});

document.getElementById("postorderButton").addEventListener("click", () => {
    const result = bst.postorderTraversal(bst.root).join(" → ");
    document.getElementById("traversalResult").innerText = `Postorder: ${result}`;
});
