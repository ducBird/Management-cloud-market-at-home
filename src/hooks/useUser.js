import create from "zustand";
import { persist, devtools } from "zustand/middleware";

const persistOptions = {
  name: "user-storage",
  getStorage: () => localStorage,
  // getStorage: () => sessionStorage, // (optional) by default, 'localStorage' is used
};

export const useUser = create(
  persist(
    devtools((set, get) => ({
      users: {},
      addUser: (employee) => {
        const users = get().users;
        Object.assign(users, employee);
        delete users.password;
        // users.push(employee); //push vào khi users là mảng
        return set((state) => ({ users: users }), false, {
          type: "addUser",
        });
      },
    })),
    persistOptions
  )
);
