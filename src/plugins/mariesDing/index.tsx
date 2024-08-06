import { PresenceStore, Tooltip, UserStore } from "@webpack/common";
import definePlugin, { OptionType } from "@utils/types";

let userList: string[] = [];

async function retreiveFromStorage() {
    const storedUsers = await PresenceStore.get("userIndicatorPlugin_UserList");
    userList = storedUsers ? JSON.parse(storedUsers) : [];
}

async function saveToStorage() {
    await PresenceStore.set("userIndicatorPlugin_UserList", JSON.stringify(userList));
}

async function addUserToList(user: string) {
    userList.push(user);
    await saveToStorage();
}

async function removeUserFromList(user: string) {
    userList = userList.filter(u => u !== user);
    await saveToStorage();
}

export default definePlugin({
    name: "User Indicator Plugin",
    description: "Add a little Indicator to everyone's username",
    authors: [{
        name: "aph",
        id: 188014835181551617n
    }],
    dependencies: ["MessageDecorationsAPI", "MemberListDecoratorsAPI"],

    options: {
        indicator: {
            type: OptionType.STRING,
            description: "The string to display as indicator",
            default: "🔔"
        },
        userList: {
            type: OptionType.COMPONENT,
            description: "List of Users",
            component: () => (
                <>
                    <ul>
                        {userList.map(user => (
                            <li key={user}>
                                {user} <button onClick={() => removeUserFromList(user)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    <input id="userInput" type="text" placeholder="Enter user ID" />
                    <button onClick={() => {
                        const inputElement = document.getElementById('userInput') as HTMLInputElement;
                        if (inputElement && inputElement.value) {
                            addUserToList(inputElement.value);
                            inputElement.value = ''; // Clear input
                        }
                    }}>Add User</button>
                </>
            )
        },
        list: {
            description: "Show Indicator in MemberList",
            type: OptionType.BOOLEAN,
            onChange(value: Boolean) {
                if (value) {
                    // log input of userList
                }
            },
        },
    },

    async start() {
        await retreiveFromStorage();
    },

    stop() {
        console.log("stopped");
    }
});
