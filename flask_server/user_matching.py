'''
Extrovert vs introvert: 
    number from 0 to 1
    0 for extrovert
    1 for introvert

Preferred time: number selection
    0 for morning (before 12 pm)
    1 for afternoon (before 4 pm)
    2 for evening (before 8 pm) 
    3 for night (after 8 pm)
-> Different plots per time slot

In person vs virtual: 
    0 for online
    1 for in person

If in person:
Public space vs private space: 
    0 for public
    1 for private
'''

import random


class User:
    def __init__(self):
        self.personality: float = 0
        self.preferred_time: int = 0
        self.in_person: bool = False
        self.private_space: bool = False
        self.group_number: int = 0

    def update(self):
        ...


class UserMatchClient:
    def __init__(self, users: list[User], min_filter_users=10) -> None:
        self.users: list[User] = users
        self.unmatched_users: list[User] = self._populate_unmatched()
        self.min_filter_users: int = min_filter_users
        
        self._stage: int = 0

    def _populate_unmatched(self) -> list[User]:
        return list(filter(lambda u: u.group_number == 0, self.users))

    def _expand_time(self, filtered: list[User], user: User) -> list[User]:
        while len(filtered) <= self.min_filter_users:
            self._stage += 1

            match self._stage:
                case 1:
                    filtered = list(filter(
                        lambda u: u.preferred_time in range(
                            user.preferred_time - 1,
                            user.preferred_time + 1,
                        ), self.unmatched_users))
                    break

                case 2:
                    filtered = list(filter(lambda u: u.preferred_time in range(0, 4), self.unmatched_users))
                    return filtered

        return filtered

    def match(self, user: User) -> bool:
        filtered: list[User] = []

        time_filter = list(filter(lambda u: u.preferred_time == user.preferred_time, self.unmatched_users))
        location_filter = list(filter(lambda u: u.in_person == user.in_person, time_filter))

        if user.in_person:
            private_filter = list(filter(lambda u: u.private_space == user.private_space, location_filter))

            if len(private_filter) > self.min_filter_users:
                filtered = location_filter

        if len(filtered) <= self.min_filter_users:
            filtered = time_filter

        # 0 ->-1, 0, 1  -> 0, 1, 2, 3
        # 1 -> 0, 1, 2  -> 0, 1, 2, 3
        # 2 -> 1, 2, 3  -> 0, 1, 2, 3
        # 3 -> 2, 3, 4  -> 0, 1, 2, 3

        filtered = self._expand_time(filtered, user)
        
        filtered.sort(key=lambda u: u.personality)
        
        user_index: int = filtered.index(user)
        num_groups: int = len(filtered) // 4
        
        for i in range(num_groups):
            if i * 4 > user_index:
                user.group_number = i + 1
                self.unmatched_users.remove(user)
                print(user.group_number)
                return True
            
        return False
    

def test():
    users: list[User] = []
    for i in range(102):
        users.append(User())
        users[i].personality = random.random()
        users[i].preferred_time = random.randint(0, 3)
        users[i].in_person = random.randint(0, 1)

        if users[i].in_person:
            users[i].private_space = random.randint(0, 1)

    matchClient = UserMatchClient(users=users)

    matchClient.match(users[6])     # 2
    matchClient.match(users[13])    # 4
    matchClient.match(users[21])    # -1

    # for i in users:
    #     print(i.group_number)


if __name__ == "__main__":
    test()
