import random

class AIState:
    IDLE = 0
    AGGRESSIVE = 1
    DEFENSIVE = 2

def moveAI(char, pos, opos, screen_width, screen_height, target):
    dx = 0
    dy = 0

    # Determine the AI's state based on its health and distance from the player
    distance = abs(pos - opos)
    
    if char.health <= 20:
        char.state = AIState.DEFENSIVE
    elif distance < 150:
        char.state = AIState.AGGRESSIVE
    else:
        char.state = AIState.IDLE

    # Behavior based on state
    if char.state == AIState.IDLE:
        # Randomly move or stay idle
        if random.random() < 0.1:
            dx = char.speed if random.choice([True, False]) else -char.speed
        if random.random() < 0.05:
            dy = -20  # Jump occasionally
        char.update()  # Update state and animations
        
    elif char.state == AIState.AGGRESSIVE:
        # Approach the player
        if pos - opos > 50:
            dx = -char.speed
        elif pos - opos < -50:
            dx = char.speed
        
        # Randomly attack
        if random.random() < 0.2:
            if char.attack_cooldown <= 0:
                char.attack(target)
                char.attacking = True
                char.attack_type = random.choice([1, 2])  # Random attack type
                char.attack_cooldown = 40
        
        # Ensure players face each other
        if target.rect.centerx > char.rect.centerx:
            char.flip = False
        else:
            char.flip = True

        # Ensure player stays on screen
        if char.rect.left + dx < 0:
            dx = -char.rect.left
        if char.rect.right + dx > screen_width:
            dx = screen_width - char.rect.right
        
        # Update player position
        char.rect.x += dx
        char.rect.y += dy

        char.update()  # Update state and animations
        
    elif char.state == AIState.DEFENSIVE:
        # Move away from player and block
        if pos - opos < 50:
            dx = -char.speed
        else:
            dx = char.speed

        # Occasionally block or dodge
        if random.random() < 0.1:
            char.defending = True
            if random.random() < 0.5:
                char.attack_cooldown = 40  # Reset cooldown if attacking

        # Ensure players face each other
        if target.rect.centerx > char.rect.centerx:
            char.flip = False
        else:
            char.flip = True

        # Ensure player stays on screen
        if char.rect.left + dx < 0:
            dx = -char.rect.left
        if char.rect.right + dx > screen_width:
            dx = screen_width - char.rect.right

        # Update player position
        char.rect.x += dx
        char.rect.y += dy

        char.update()  # Update state and animations
        
    # Update cooldown
    if char.attack_cooldown > 0:
        char.attack_cooldown -= 1
