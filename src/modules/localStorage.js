
const store = (() => {
    const getLinks = () => localStorage.getItem('links') || [];

    const addShortLinks = (linkObj) => {
        let links = getLinks();
        links.push(linkObj);
        localStorage.setItem('links', JSON.stringify(links));
    }

    return { getLinks, addShortLinks }
})();

