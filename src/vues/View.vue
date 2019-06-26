<template>
    <div class="container mt-5">
        <div class="clearfix">
            <router-link :to="rl('list')" class="btn btn-dark btn-sm"><i class="fa fa-arrow-left mr-1"></i> Go Back</router-link>
        </div>
        <div class="card shadow mt-2">
            <div class="card-body">
                <h2 class="mb-1">{{fileName}}</h2>
                <span>{{file.fullPath}}</span>

                <div class="mt-5">
                    <PrismEditor :code="file.content" language="js" :readonly="true"></PrismEditor>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "prismjs"
    import "prismjs/themes/prism-okaidia.css";

    import PrismEditor from 'vue-prism-editor';
    export default {
        components: {PrismEditor},
        data() {
            return {
                file: {
                    content: '',
                    fullPath: ''
                }
            }
        },

        computed: {
          fileName(){
              const slashSplit = this.file.fullPath.split('/');
              if(slashSplit.length>0){
                  return slashSplit[slashSplit.length-1];
              }
              return this.file.fullPath;
          }
        },

        mounted() {
            const filePath = this.$route.params['file_path'];
            this.$api.getFrom('api/file/read?file='+filePath, {}, {
                yes: (data) => {
                    this.file = data;
                },
                no: (api) => {
                    console.log("Yes");
                    console.log(api);
                }
            })
        }
    }
</script>
