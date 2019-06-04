const route = $.router;

route.path("/folder", () => {
    route.all('@scan')
}).controller('Folder');