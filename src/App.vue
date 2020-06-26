<template>
    <div>
        <router-view v-if="loadedConfig" :key="$route.fullPath"></router-view>
        <template v-else>
            <div class="container mt-5">
                <div v-if="loadedConfig===false" class="box has-text-centered">
                    <Busy>
                        <br>
                        <strong>Loading configurations</strong>
                    </Busy>
                </div>
                <div v-else-if="loadedConfig===null" class="alert alert-danger" role="alert">
                    <strong>Error:</strong> Failed to load configurations from server.
                </div>
            </div>
        </template>
        <div class="mt-5 text-center">
            <a target="_blank " href="https://github.com/trapcodeio/dark-vault.git" class="text-white"><i
                    class="fab fa-github"></i>
                Github</a>
            <br>
            <a target="_blank" href="https://xpresserjs.com" class="text-danger">
                <i class="fas fa-code mr-1"></i>
                <span>Built with </span> Xpresser
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loadedConfig: false
            }
        },

        mounted() {
            // load config from server.
            this.getConfigurations();
        },

        methods: {
            getConfigurations() {
                return this.$api.getFromRoute('/data/config', {}, {
                    yes: ({config}) => {
                        if (config) this.$store.commit('setConfig', config);
                        this.loadedConfig = true;
                    }
                })
            }
        }
    }
</script>
