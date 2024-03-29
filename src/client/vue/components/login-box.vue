<template>
    <div class="nav-item dropdown">
        <a class="nav-link dropdown-toggle text-decoration-none text-light" data-bs-toggle="dropdown"
            id="navbarDropdownMenuLink" aria-haspopup="true" role="button" aria-expanded="false">
            <img class="player-avatar" :src="`https://a.ppy.sh/${user.osuID}`">
            <span>
                <template v-if="!user.osuLinked">
                    {{ $t("header.login-box.login") }}
                </template>
                <template v-else>
                    {{ user.username }}
                </template>
            </span>
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
            <a class="dropdown-item" @click="osuAction()">
                <i class="bi-osu"></i>
                <template v-if="!user.osuLinked">
                    {{ $t("header.login-box.osu") }}
                </template>
                <template v-else>
                    {{ $t("header.login-box.delink") }}
                </template>
            </a>
            <a :hidden="(!user.osuLinked && !user.discordLinked) || (user.discordLinked && user.remainingDelinkTime != undefined)"
                class="dropdown-item" @click="discordAction()">
                <i class="bi bi-discord"></i>
                <template v-if="!user.discordLinked">
                    {{ $t("header.login-box.discord") }}
                </template>
                <template v-else>
                    {{ $t("header.login-box.delink") }}
                </template>
            </a>
            <a class="alt dropdown-item" v-if="user.deadlineDate">
                <i class="bi bi-discord"></i>
                &nbsp;<timer-item :deadline="user.deadlineDate"></timer-item>
            </a>
        </div>
    </div>
</template>

<script lang="ts">
import axios from "axios";

import { defineComponent } from 'vue';
import timerItem from "./timer-item.vue";

interface UserInformation {
    id: string,
    lastLogin: Date,
    avatar_url: string,
    osuID?: number,
    username?: string,
    discordID?: string,
    discordName?: string,
    osuLinked: boolean,
    remainingDelinkTime?: number,
    discordLinked: boolean,
    deadlineDate: number
}

export default defineComponent({
    name: "login-box",
    components: {
        timerItem
    },
    data() {
        return {
            user: <UserInformation>{},
            defaultUser: {
                osuLinked: false,
                discordLinked: false,
                deadlineDate: null
            }
        }
    },
    methods: {
        async reloadData(): Promise<void> {
            let res = await axios.get<{ user: UserInformation }>("/api/user");
            let data = res.data.user;

            if (data) {
                const now = new Date();
                this.user = data;
                if (data.remainingDelinkTime) {
                    this.user.deadlineDate = now.setMilliseconds(now.getMilliseconds() + data.remainingDelinkTime);
                }
            } else {
                this.user = this.defaultUser;
            }
        },
        async osuAction(): Promise<void> {
            if (!this.user.osuLinked) {
                window.location.href = "/api/auth/osu";
            } else {
                await axios.get("/api/auth/logout");
                this.reloadData();
            }
        },
        async discordAction(): Promise<void> {
            if (!this.user.discordLinked) {
                window.location.href = "/api/auth/discord";
            } else {
                if (!this.user.availableDelinkDate) {
                    await axios.get("/api/auth/discord/delink");
                    this.reloadData();
                }
            }
        }
    },
    mounted(): void {
        this.reloadData();
    }
});
</script>