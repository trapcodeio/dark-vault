<template>
    <div class="container">
        <div class="card mt-3 mt-lg-5 shadow is-fixed-height">
            <div class="card-body">
                <ol v-if="currentFolderToArray.length" class="breadcrumb">
                    <template v-for="(path, pathId) in currentFolderToArray">

                        <template v-if="currentFolderToArray[pathId+1]===undefined">
                            <li :key="pathId" class="breadcrumb-item active">{{path}}</li>
                        </template>

                        <template v-else>
                            <li :key="pathId" class="breadcrumb-item">
                                <a href="#" @click.prevent="fromBreadcrumb(pathId)">{{path}}</a>
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

                <div class="mt-4" v-if="!isLoading">
                    <div class="row">
                        <div class="col-auto">
                            <button @click.prevent="goBack" class="btn btn-dark btn-sm mt-2"><i
                                    class="fas fa-arrow-left "></i> Go Back
                            </button>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <input @focusin.prevent="focusedIn" @focusout.prevent="focusedOut" v-model="search"
                                       type="text" :placeholder="currentFolder" class="form-control shadow-sm">
                            </div>
                        </div>

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

                    <template v-for="(folder, folderIndex)  in files">
                        <div :key="folderIndex" v-if="folder.isDir"
                             @dragenter.prevent="mouseOnFolder(folderIndex)"
                             @dragleave.prevent="mouseOffFolder(folderIndex)"
                             @dragover.prevent="() =>false"
                             @drop="dropOnFolder"
                             :class="dragDestination===folderIndex?'folder-list on-me':'folder-list'">
                            <router-link :draggable="false" :to="rl('folder', {folder_path: folder.encodedPath})"
                                         :title="folder.fullPath">
                                <i class="fas fa-folder mr-3 text-dark"></i>
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
                            <router-link :draggable="false" :to="rl('file', {file_path: file.encodedPath})"
                                         :title="file.fullPath">
                                <i class="far fa-file fa-1x mr-3 text-muted"></i>
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
    export default {
        data() {
            return {
                isLoading: true,
                isSearching: false,
                dirtyByComputer: true,
                currentFolder: '',
                files: [],
                search: '',
                watchSearch: true,
                searchTimeOut: -1,

                errorMessage: '',

                dragFile: null,
                dragDestination: null
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
            search() {
                if (this.search.length > 0) {
                    if (!this.dirtyByComputer) {
                        clearTimeout(this.searchTimeOut);

                        // Uncomment these lines to make search slow.
                        // this.searchTimeOut = setTimeout(() => {
                        this.loadFolder(this.search)
                        // }, 300);
                    }

                    this.dirtyByComputer = false;
                }
            }
        },

        mounted() {
            setTimeout(() => {
                this.loadFolder();
            }, 300);
        },

        methods: {
            loadFolder(id) {
                if (!this.isSearching) {
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
                        this.files = data.files;
                        this.currentFolder = data.folder.replace(/\\/g, '/');
                        window.dvCurrentFolder = this.currentFolder;
                    },

                    no: (result) => {
                        this.showError(result.data);
                    },

                    any: () => {
                        this.isLoading = false;
                    }
                })
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
                this.isSearching = true;
                if (!this.search.length) {
                    this.search = this.currentFolder;
                    this.dirtyByComputer = true;
                }
            },

            focusedOut() {
                this.isSearching = false;
                if (this.dirtyByComputer) {
                    this.search = "";
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
</style>
