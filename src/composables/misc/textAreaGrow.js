// auto increase the height of textarea
const grow = (e) => {
    e.target.style.height = "5px";
    e.target.style.height = e.target.scrollHeight + "px";
};

export default grow