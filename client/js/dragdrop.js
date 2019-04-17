/**
 * Called when dragging an element over a droppable area to allow the element to
 * be dropped.
 *
 * @param event The drag event
 */
function enableDrop(event) {
    event.preventDefault();
}

/**
 * Called when dragging an element to bind it's id to the event.
 *
 * @param event The drag event
 */
function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

/**
 * Called when dropping an element. If the element is dropped on another they
 * are swapped, otherwise it is moved to the end.
 *
 * @param event The drag event
 */
function drop(event) {
    event.preventDefault();
    let display = document.getElementById("display");
    let element = document.getElementById(event.dataTransfer.getData("text"));
    let index1 = Array.prototype.indexOf.call(display.children, element);
    let index2 = Array.prototype.indexOf.call(display.children, event.target);
    if (index2 === -1) {
        display.append(element);
    } else if (index1 < index2) {
        display.insertBefore(element, event.target.nextSibling);
        display.insertBefore(event.target, display.children[index1]);
    } else {
        display.insertBefore(element, event.target);
        display.insertBefore(event.target, display.children[index1].nextSibling);
    }
}