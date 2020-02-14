<template>
    <div>
        <router-view :key="$route.fullPath"></router-view>
        <div class="mt-5 text-center">
            <a target="_blank " href="https://github.com/trapcodeio/dark-vault.git" class="text-white"><i class="fab fa-github"></i>
                Github</a>
            <br>
            <a target="_blank" href="https://xpresserjs.com" class="text-danger">
                <i class="fas fa-code mr-1"></i>
                <span>Built with </span> Xpresser
            </a>
        </div>
    </div>
</template>
