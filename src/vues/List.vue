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
                        <div :key="folderIndex" v-if="folder.isDir">
                            <router-link :to="rl('folder', {folder_path: folder.encodedPath})" :title="folder.fullPath">
                                <i class="fas fa-folder mr-3 text-dark"></i>
                                <span>{{folder.name}}</span>
                            </router-link>
                            <hr class="mt-1">
                        </div>
                    </template>

                    <template v-for="(file, fileIndex) in files">
                        <div :key="fileIndex" v-if="!file.isDir">
                            <router-link :to="rl('file', {file_path: file.encodedPath})" :title="file.fullPath">
                                <i class="fa fa-file fa-1x mr-3 text-muted"></i>
                                <span v-if="file.name[0]==='.'" class="text-muted">{{file.name}}</span>
                                <span v-else>{{file.name}}</span>
                            </router-link>
                            <hr class="mt-1">
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

                errorMessage: ''
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
                        const self = this;

                        clearTimeout(this.searchTimeOut);

                        // Uncomment these lines to make search slow.
                        // this.searchTimeOut = setTimeout(() => {
                        self.loadFolder(this.search)
                        // }, 300);
                    }

                    this.dirtyByComputer = false;
                }
            }
        },

        mounted() {
            const self = this;
            setTimeout(() => {
                self.loadFolder();
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
                    if (this.$route.params.hasOwnProperty('folder_path')) {
                        folder = atob(this.$route.params.folder_path);
                    }

                    if (folder === 'base://') {
                        folder = undefined;
                    }
                }

                const self = this;
                this.$api.postTo('api/folder/scan', {folder}, {
                    yes(data) {
                        self.errorMessage = '';
                        self.files = data.files;
                        self.currentFolder = data.folder.replace(/\\/g, '/');
                        window.dvCurrentFolder = self.currentFolder;
                    },

                    no(result) {
                        self.showError(result.data);
                    },

                    any() {
                        self.isLoading = false;
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

                const self = this;

                setTimeout(() => {
                    self.errorMessage = '';
                }, 10000);
            }
        }
    }
</script>
