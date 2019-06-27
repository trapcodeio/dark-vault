<template>
    <div class="container mt-5">
        <div class="jumbotron text-center bg-light">
            <h1 class="display-3">Dark Vault</h1>
            <p class="lead">A simple NodeJs File Manager</p>
            <hr class="mt-0 mb-5">
            <p>Your files are waiting for you...</p>
            <p class="lead">
                <router-link :to="rl('folder', {folder_path: basePath})" class="btn btn-primary btn-lg"
                             :href="'/folder/'+basePath" role="button"><i class="fa fa-folder mr-2"></i> Files &
                    Directories
                </router-link>
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                basePath: btoa('base://')
            }
        }
    }
</script>
