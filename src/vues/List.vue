<template>
    <div class="container">
        <div class="card mt-3 mt-lg-5 shadow is-fixed-height">
            <div class="card-body">
                <ol v-if="currentFolderToArray.length" class="breadcrumb p-1">
                    <template v-for="(path, pathId) in currentFolderToArray">

                        <template v-if="currentFolderToArray[pathId+1]===undefined">
                            <li :key="pathId" class="breadcrumb-item active">
                                <small>{{path}}</small>
                            </li>
                        </template>

                        <template v-else>
                            <li :key="pathId" class="breadcrumb-item">
                                <a href="#" @click.prevent="fromBreadcrumb(pathId)">
                                    <small>{{path}}</small>
                                </a>
                            </li>
                        </template>

                    </template>
                </ol>

                <template v-if="isLoading">
                    <div class="text-center">
                        <div class="spinner-border" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                </template>

                <div class="mt-3" v-if="!isLoading">
                    <div class="row">
                        <div class="col-auto">
                            <button @click.prevent="goBack" class="btn btn-outline-dark btn-sm mt-1"><i
                                    class="fas fa-arrow-left "></i> Go Back
                            </button>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <input @focusin.prevent="focusedIn" @focusout.prevent="focusedOut" v-model="path"
                                       type="text" :placeholder="currentFolder"
                                       class="form-control form-control-sm shadow-sm">
                            </div>
                        </div>
                        <div class="col-auto">
                            <div class="form-group">
                                <input v-model="filter"
                                       type="search" placeholder="Filter.."
                                       class="form-control form-control-sm shadow-sm">
                            </div>
                        </div>
                        <div class="col-auto">
                            <button @click="showMoreOptions=!showMoreOptions" class="btn btn-outline-dark btn-sm mt-1">
                                <i v-if="showMoreOptions" class="fas fa-chevron-up"></i>
                                <i v-else class="fas fa-chevron-down"></i>
                            </button>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12" v-if="errorMessage.length">
                            <div class="alert alert-danger" role="alert">
                                <i class="fas fa-exclamation-triangle mr-2"></i> <span v-html="errorMessage"></span>

                                <button @click.prevent="errorMessage=''" type="button" class="close"
                                        data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <transition name="fade">
                        <template v-if="showMoreOptions">
                            <div class="row mb-3">
                                <div class="col-12">
                                    <input v-model="options.showHiddenFiles" type="checkbox" name="showHiddenFiles">
                                    <small class="ml-2">Show hidden
                                        files</small>
                                </div>
                            </div>
                        </template>
                    </transition>

                    <template v-for="(folder, folderIndex)  in files">
                        <div :key="folderIndex" v-if="folder.isDir"
                             @dragenter.prevent="mouseOnFolder(folderIndex)"
                             @dragleave.prevent="mouseOffFolder(folderIndex)"
                             @dragover.prevent="() =>false"
                             @drop="dropOnFolder"
                             :class="dragDestination===folderIndex?'folder-list on-me':'folder-list'">
                            <router-link class="dir-link" :draggable="false"
                                         :to="rl('folder', {folder_path: folder.encodedPath})"
                                         :title="folder.fullPath">
                                <i class="fas fa-folder mr-3 text-info"></i>
                                <span>{{folder.name}}</span>
                            </router-link>
                        </div>
                    </template>

                    <template v-for="(file, fileIndex) in files">
                        <div :key="fileIndex" v-if="!file.isDir"
                             draggable="true"
                             @dragend="onFileDrop"
                             @dragstart="onFileDrag(fileIndex)"
                             @dragover="onFileHover"
                             class="file-list">
                            <router-link class="file-link" :draggable="false"
                                         :to="rl('file', {file_path: file.encodedPath})"
                                         :title="file.fullPath">
                                <i :class="iconFor(file.ext)"></i>
                                <span v-if="file.name[0]==='.'" class="text-muted">{{file.name}}</span>
                                <span v-else>{{file.name}}</span>
                            </router-link>
                        </div>
                    </template>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import BrowserStorage from "@trapcode/browser-storage";

    const store = new BrowserStorage('list');
    const extensionClass = {
        js: 'fab fa-js-square',
        md: 'fab fa-markdown',
        json: 'far fa-brackets-curly',
        config: 'far fa-brackets-curly',
        php: 'fab fa-php',
        py: 'fab fa-python',
        go: 'fab fa-google',
        html: 'fab fa-html5',
        ts: 'far fa-text',

        sqlite: 'fad fa-database',

        jpeg: 'fad fa-image',
        jpg: 'fad fa-image',
        png: 'fad fa-image',
        gif: 'fad fa-image',
        svg: 'fad fa-image',

        zip: 'fad fa-file-archive',
        bz2: 'fad fa-file-archive',

        pdf: 'fad fa-file-pdf',
        exe: 'fad fa-file-pdf',

        dmg: 'fad fa-box-open',

        mp3: 'fad fa-music',
        mp4: 'fad fa-video',
        mov: 'fad fa-video',

        vue: 'fab fa-vuejs',
        lock: 'fad fa-lock',

        xml: 'fad fa-code'
    };
    const extensionsWithCustomIcons = Object.keys(extensionClass);

    export default {
        data() {
            return {
                isLoading: true,
                isChangingPath: false,
                dirtyByComputer: true,
                currentFolder: '',
                files: [],
                filesFromServer: [],
                path: '',
                filter: '',
                watchSearch: true,
                searchTimeOut: -1,

                errorMessage: '',

                dragFile: null,
                dragDestination: null,

                showMoreOptions: false,

                options: {
                    showHiddenFiles: false
                }
            };
        },

        computed: {
            currentFolderToArray() {
                let folder = this.currentFolder;
                if (folder.substr(-1) === '/') {
                    folder = folder.substr(0, folder.length - 1);
                }
                return folder.split('/')
            }
        },

        watch: {
            path() {
                if (this.path.length > 0) {
                    if (!this.dirtyByComputer) {
                        clearTimeout(this.searchTimeOut);

                        // Uncomment these lines to make search slow.
                        this.searchTimeOut = setTimeout(() => {
                            this.loadFolder(this.path)
                        }, 300);
                    }

                    this.dirtyByComputer = false;
                }
            },

            filter() {
                this.filterFiles()
            },

            'options.showHiddenFiles'() {
                this.saveOptionsToLocalStorage();
                this.toggleHiddenFiles()
            }
        },

        mounted() {
            if (store.local.has('options')) {
                this.options = store.local.getObject('options')
            }
            // setTimeout(() => {
            this.loadFolder();
            // }, 300);
        },

        methods: {
            loadFolder(id) {
                if (!this.isChangingPath) {
                    this.isLoading = true;
                }

                let folder = undefined;
                if (typeof id === "string") {
                    folder = id;
                } else {
                    if (this.$route.params['folder_path']) {
                        folder = atob(this.$route.params.folder_path);
                    }

                    if (folder === 'base://') {
                        folder = undefined;
                    }
                }

                this.$api.postTo('api/folder/scan', {folder}, {
                    yes: (data) => {
                        this.errorMessage = '';
                        this.filesFromServer = data.files;
                        this.loadFiles(data.files);
                        this.currentFolder = data.folder.replace(/\\/g, '/');
                        window.dvCurrentFolder = this.currentFolder;
                    },

                    no: ({msg}) => {
                        this.showError(msg);
                    },

                    any: () => {
                        this.isLoading = false;
                    }
                })
            },

            loadFiles(files) {
                this.files = files;
                this.toggleHiddenFiles();
            },

            saveOptionsToLocalStorage() {
                store.local.setObject('options', this.options)
            },

            fromBreadcrumb(stopAtId, push = true) {
                let currentPath = this.currentFolderToArray;

                const folder = btoa(currentPath.slice(0, stopAtId + 1).join('/'));

                if (push) {
                    this.$router.push(this.rl('folder', {folder_path: folder}))
                } else {
                    return folder;
                }
            },

            goBack() {
                return this.fromBreadcrumb(this.currentFolderToArray.length - 2);
            },

            focusedIn() {
                this.isChangingPath = true;
                if (!this.path.length) {
                    this.path = this.currentFolder;
                    this.dirtyByComputer = true;
                }
            },

            focusedOut() {
                this.isChangingPath = false;
                if (this.dirtyByComputer) {
                    this.path = "";
                }
            },

            showError(msg) {
                this.errorMessage = msg;
                setTimeout(() => {
                    this.errorMessage = '';
                }, 10000);
            },

            onFileDrag(folder) {
                this.dragFile = folder;
            },

            onFileHover() {
                this.dragDestination = null;
            },

            onFileDrop() {
                this.dragDestination = null;
            },

            dropOnFolder() {
                if (this.dragFile) {
                    const folder = this.files[this.dragDestination];
                    const file = this.files[this.dragFile];

                    this.files.splice(this.dragFile, 1);

                    return this.$api.postTo('api/file/move', {
                        folder: folder.encodedPath, file: file.encodedPath
                    }, {
                        no: () => {
                            this.files.splice(this.dragFile, 0, file);
                        }
                    });
                }
            },

            mouseOnFolder(folder) {
                this.dragDestination = folder;
            },

            mouseOffFolder() {
                // this.dragDestination = null;
            },

            switchToFilesFromServer() {
                this.files = this.filesFromServer
            },

            filterFiles() {
                if (this.filter.length) {
                    const newList = [];

                    for (const file of this.files) {
                        if (file.name === '..') {
                            newList.push(file)
                        } else if (file.name.indexOf(this.filter) >= 0) {
                            newList.push(file)
                        }
                    }

                    this.files = newList;
                } else {
                    this.switchToFilesFromServer()
                }
            },

            toggleHiddenFiles() {
                if (this.options.showHiddenFiles) {
                    this.switchToFilesFromServer()
                } else {
                    const newList = [];

                    for (const file of this.files) {
                        if (file.name === '..') {
                            newList.push(file)
                        } else if (file.name[0] !== '.') {
                            newList.push(file)
                        }
                    }

                    this.files = newList;

                }
            },

            iconFor(ext) {
                let faClass = 'far fa-file';

                if (ext && extensionsWithCustomIcons.includes(ext)) {
                    faClass = extensionClass[ext]
                }

                return `${faClass} mr-3 text-muted`;
            }
        }
    }
</script>

<style lang="scss">
    .folder-list {
        padding: 10px;
        border-bottom: 1px solid fade_out(#999999, 0.7);

        &.on-me {
            background-color: fade_out(#1d2124, 0.3);
            border-radius: 7px;

            * {
                color: antiquewhite !important;
            }
        }
    }

    .file-list {
        padding: 10px;
        border-bottom: 1px solid fade_out(#999999, 0.7);
    }

    .file-link, .dir-link {
        font-size: 14px;
    }
</style>
