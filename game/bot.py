def moveAI(char, pos, opos, screen_width, screen_height, target):
    dx = 0
    if char.health > 0:
        if char.attack_cooldown > 0:
            if abs(pos-opos) > 50:
                if pos-opos > 50:
                    dx = -char.speed
                if pos-opos < -50:
                    dx = char.speed

                # ensure player stays on screen
                if char.rect.left + dx < 0:
                    dx = 0 - char.rect.left
                if char.rect.right + dx > screen_width:
                    dx = screen_width - char.rect.right
                '''if char.rect.bottom + dy > screen_height +65:
                    char.vel_y = 0
                    char.jump = False
                    dy = screen_height +65 - char.rect.bottom'''

                # ensure players face each other
                if target.rect.centerx > char.rect.centerx:
                    char.flip = False
                else:
                    char.flip = True

                # apply attack cooldown
                if char.attack_cooldown > 0:
                    char.attack_cooldown -= 1


                # update player position
                char.rect.x += dx
                #char.rect.y += dy
        else:
                char.attack(target)
                char.attacking = True
                char.attack_type = 1
                char.attack_cooldown = 40
        if char.attack_cooldown > 0:
                char.attack_cooldown -= 1
        char.update()