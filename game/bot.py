def moveAI(char, pos, opos, screen_width, screen_height, target):
    dx = 0
    if char.health > 0:
        # Check if opponent is alive
        if target.health > 0:
            if char.attack_cooldown > 0:
                if abs(pos - opos) > 50:
                    if pos - opos > 50:
                        dx = -char.speed
                    if pos - opos < -50:
                        dx = char.speed

                # Ensure player stays on screen
                if char.rect.left + dx < 0:
                    dx = 0 - char.rect.left
                if char.rect.right + dx > screen_width:
                    dx = screen_width - char.rect.right

                # Ensure players face each other
                if target.rect.centerx > char.rect.centerx:
                    char.flip = False
                else:
                    char.flip = True

                # Apply attack cooldown
                if char.attack_cooldown > 0:
                    char.attack_cooldown -= 1

                # Update player position
                char.rect.x += dx

            else:
                char.attack(target)
                char.attacking = True
                char.attack_type = 1
                char.attack_cooldown = 50

        else:
            # If the opponent is dead, the AI might just idle or perform another action
            # For example, you might want to set the AI to idle or stop moving
            char.attacking = False
            char.update()  # Update the AI state without attacking

    else:
        # If the AI is dead, it should not be able to perform any actions
        char.attacking = False
        char.update()
