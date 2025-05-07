package highFive.calendar.dto;

import highFive.calendar.entity.User;

public interface UserMapper {

    //  DTO -> Entity
    default User dtoToEntity(UserDto userDto) {
        return User.builder()
                .userId(userDto.getUserId())
                .email(userDto.getEmail())
                .pwd(userDto.getPwd())
                .name(userDto.getName())
                .gender(userDto.getGender())
                .build();
    }

    //  Entity -> DTO
    default UserDto entityToDto(User user) {
        return UserDto.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .pwd(user.getPwd())
                .name(user.getName())
                .gender(user.getGender())
                .build();
    }
}
