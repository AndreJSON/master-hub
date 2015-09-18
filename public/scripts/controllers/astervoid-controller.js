/*global masterApp*/

masterApp.controller('astervoidController', function ($scope, $log, $timeout, $http) {
	'use strict';
	var loadingJSON = 0, enemyLoading = 0, before = 0, up = false, down = false, left = false, right = false, spacebar = false;
	
	/**
	* Continuously redraws the screen using requestAnimationFrame.
	*/
	$scope.mainLoop = function (pe, oe) {
		$scope.drawBackground();
		if ($scope.inGame && loadingJSON === 0) {
			$scope.drawGame(pe, oe);
			$scope.physicsHandling(pe, oe);
		} else if (pe[0] !== undefined) {
			$scope.drawMenu(pe[0]);
		}
		window.requestAnimationFrame(function () {$scope.mainLoop(pe, oe); });
	};
	
	$scope.drawBackground = function () {
		//Draw the background
		$scope.canvas.beginPath();
		$scope.canvas.rect(0, 0, $scope.gameWidth, $scope.gameHeight);
		$scope.canvas.fillStyle = $scope.map.color;
		$scope.canvas.fill();
	};
	
	$scope.drawMenu = function (player) {
		//Draw cash amount
		$scope.canvas.font = "bold 20px monospace";
		$scope.canvas.beginPath();
		$scope.canvas.fillStyle = "rgba(65,250,80,0.6)";
		$scope.canvas.fillText('$' + $scope.healthString(player.cash.toString()), $scope.gameWidth - 90, 32);
		$scope.canvas.fill();
		//Draw stats
		$scope.canvas.beginPath();
		$scope.canvas.fillStyle = "#CCCCCC";
		$scope.canvas.fillText('Ship health  :', 25, 32);
		$scope.canvas.fillText('Health regen :', 25, 67);
		$scope.canvas.fillText('Ship speed   :', 25, 102);
		$scope.canvas.fillText('Fire rate    :', 25, 137);
		$scope.canvas.fillText('Shot damage  :', 25, 172);
		$scope.canvas.fillText('Max mod kits :', 25, 207);
		$scope.canvas.fillText('$ drop rate  :', 25, 242);
		$scope.canvas.fill();
		$scope.canvas.fillStyle = "#FFFFFF";
		$scope.canvas.fillText(player.maxHealth, 205, 32);
		$scope.canvas.fillText(player.healthRegen, 205, 67);
		$scope.canvas.fillText(player.speed * 100, 205, 102);
		$scope.canvas.fillText($scope.healthString(Math.floor(1 / player.spawners[0].cooldown * 10000).toString()), 205, 137);
		$scope.canvas.fillText(player.spawners[0].spawnHealth, 205, 172);
		$scope.canvas.fillText(player.maxMods, 205, 207);
		$scope.canvas.fillText(Math.round(player.dropRate * 100) / 100, 205, 242);
		$scope.canvas.fill();
		$scope.canvas.beginPath();
		$scope.canvas.strokeStyle = "#CCCCCC";
		$scope.canvas.rect(10, 10, 515, 421);
		$scope.canvas.stroke();
		//Draw upgrade menu
		$scope.canvas.beginPath();
		$scope.canvas.fillText('Cost: $' + $scope.healthString($scope.upgradeCost('health', player).toString()), 935, 89);
		$scope.canvas.fillText('Cost: $' + $scope.healthString($scope.upgradeCost('healthRegen', player).toString()), 935, 152);
		$scope.canvas.fillText('Cost: $' + $scope.healthString($scope.upgradeCost('cooldown', player).toString()), 935, 215);
		$scope.canvas.fillText('Cost: $' + $scope.healthString($scope.upgradeCost('damage', player).toString()), 935, 279);
		$scope.canvas.fillText('Cost: $' + $scope.healthString($scope.upgradeCost('mods', player).toString()), 935, 342);
		$scope.canvas.fillText('Cost: $' + $scope.healthString($scope.upgradeCost('dropRate', player).toString()), 935, 405);
		$scope.canvas.fill();
		$scope.canvas.beginPath();
		$scope.canvas.fillStyle = "#CCCCCC";
		$scope.canvas.fillText('Maximum health +1', 660, 89);
		$scope.canvas.fillText('Health regen +1', 660, 152);
		$scope.canvas.fillText('Cannon fire rate +1', 660, 215);
		$scope.canvas.fillText('Cannon damage +1', 660, 279);
		$scope.canvas.fillText('Max mods kits +1', 660, 342);
		$scope.canvas.fillText('Ca$h drop rate +1', 660, 405);
		$scope.canvas.fill();
		$scope.canvas.beginPath();
		$scope.canvas.strokeStyle = "#CCCCCC";
		$scope.canvas.rect(638, 50, 551, 381);
		$scope.canvas.stroke();
		//Draw mod kits
		$scope.canvas.beginPath();
		$scope.canvas.strokeStyle = "CCCCCC";
		$scope.canvas.rect(538, 444, 651, 346);
		$scope.canvas.stroke();
		$scope.canvas.beginPath();
		$scope.canvas.fillText("Mod kits coming soon!", 730, 625);
		$scope.canvas.fill();
		//Show this message in case the buttons dont appear.
		$scope.canvas.font = "bold 10px monospace";
		$scope.canvas.beginPath();
		$scope.canvas.fillText('Press spacebar', 540, 420);
		$scope.canvas.fill();
	};
	
	$scope.drawGame = function (pe, oe) {
		var index;
		//Draw the playerbullets.
		for (index = 1; index < pe.length; index += 1) {
			$scope.canvas.beginPath();
			$scope.canvas.arc(pe[index].xPos, pe[index].yPos, pe[index].xSize / 2, 0, Math.PI * 2, true);
			$scope.canvas.fillStyle = pe[index].color;
			$scope.canvas.fill();
		}
		//Draw other entites.
		for (index = 0; index < oe.length; index += 1) {
			$scope.canvas.beginPath();
			$scope.canvas.arc(oe[index].xPos, oe[index].yPos, oe[index].xSize / 2, 0, Math.PI * 2, true);
			$scope.canvas.fillStyle = oe[index].color;
			$scope.canvas.fill();
			$scope.drawHealth(oe[index]);
		}
		//Draw the player entity.
		$scope.canvas.save();
		$scope.canvas.translate(pe[0].xPos, pe[0].yPos);
		$scope.canvas.rotate(pe[0].angle);
		$scope.canvas.beginPath();
		$scope.canvas.rect(-pe[0].xSize / 2 - 7, -pe[0].ySize / 2 + 6, pe[0].xSize / 4, pe[0].ySize / 4 - 2); //flames
		$scope.canvas.rect(-pe[0].xSize / 2 - 7, pe[0].ySize / 2 - 4 - pe[0].ySize / 4, pe[0].xSize / 4, pe[0].ySize / 4 - 2);
		$scope.canvas.fillStyle = "yellow";
		$scope.canvas.fill();
		$scope.canvas.beginPath();
		$scope.canvas.rect(-pe[0].xSize / 2, -pe[0].ySize / 2, pe[0].xSize, pe[0].ySize); //rocketbody
		$scope.canvas.rect(-pe[0].xSize / 2 - 5, -pe[0].ySize / 2 + 5, pe[0].xSize / 4, pe[0].ySize / 4); //backrockets
		$scope.canvas.rect(-pe[0].xSize / 2 - 5, pe[0].ySize / 2 - 5 - pe[0].ySize / 4, pe[0].xSize / 4, pe[0].ySize / 4);
		$scope.canvas.fillStyle = pe[0].color;
		$scope.canvas.fill();
		$scope.canvas.restore();
		$scope.drawHUD(pe[0]);
	};
	
	$scope.drawHealth = function (entity) {
		var healthString = $scope.healthString(entity.currentHealth.toString());
		$scope.canvas.font = "bold 20px monospace";
		$scope.canvas.beginPath();
		$scope.canvas.fillStyle = "white";
		if (entity.xSize >= healthString.length * 12 + 2) {
			$scope.canvas.fillText(healthString, entity.xPos - healthString.length * 6, entity.yPos + 6);
		} else {
			$scope.canvas.fillText(healthString, entity.xPos - healthString.length * 6, entity.yPos - entity.xSize / 2 - 1);
		}
	};
	
	$scope.drawHUD = function (player) {
		//Draw Healthbar
		$scope.canvas.beginPath();
		$scope.canvas.rect(10, 10, 200, 30);
		$scope.canvas.strokeStyle = "rgba(255,255,255,0.6)";
		$scope.canvas.stroke();
		$scope.canvas.fillStyle = "rgba(255,255,255,0.2)";
		$scope.canvas.fill();
		$scope.canvas.beginPath();
		$scope.canvas.rect(11 + 198 * (1 - player.currentHealth / player.maxHealth), 11, 198 * player.currentHealth / player.maxHealth, 28);
		$scope.canvas.fillStyle = "rgba(255,0,0,0.5)";
		$scope.canvas.fill();
		$scope.canvas.beginPath();
		$scope.canvas.font = "bold 20px monospace";
		$scope.canvas.fillStyle = "rgba(255,255,255,0.8)";
		$scope.canvas.fillText($scope.healthString(player.currentHealth.toString()), 88 - $scope.healthString(player.currentHealth.toString()).length * 12, 32);
		$scope.canvas.fillText("/ " + $scope.healthString(player.maxHealth.toString()), 100, 32);
		//Draw cash amount
		$scope.canvas.beginPath();
		$scope.canvas.fillStyle = "rgba(65,250,80,0.6)";
		$scope.canvas.fillText('$' + $scope.healthString(player.cash.toString()), $scope.gameWidth - 90, 32);
	};
	
	$scope.healthString = function (healthString) {
		if (healthString.length < 5) {
			return healthString;
		} else if (healthString.length < 8) {
			return healthString.substring(0, healthString.length - 3) + 'k';
		} else if (healthString.length < 11) {
			return healthString.substring(0, healthString.length - 6) + 'm';
		} else if (healthString.length < 14) {
			return healthString.substring(0, healthString.length - 9) + 'b';
		} else if (healthString.length < 17) {
			return healthString.substring(0, healthString.length - 12) + 't';
		} else {
			return "LOTS";
		}
	};
	
	/**
	* Performs all necessary physics calculations during one frame.
	*/
	$scope.physicsHandling = function (pe, oe) {
		$scope.regenHealth(pe[0]);
		$scope.keyHandling(pe);
		$scope.movementHandling(pe, oe);
		$scope.spawnerHandling(pe, oe);
		$scope.boundaryHandling(pe, oe);
		$scope.collisionHandling(pe, oe);
		$scope.deletionHandling(pe, oe);
		$scope.waveHandling(pe, oe);
	};
	/**
	* Regenerates the health of the player according to his health regen.
	*/
	$scope.regenHealth = function (player) {
		var now;
		now = Date.now();
		if (now - before > 1000) {
			before = now;
			player.currentHealth += player.healthRegen;
			if (player.currentHealth > player.maxHealth) {
				player.currentHealth = player.maxHealth;
			}
		}
	};
	
	/**
	* Adjusts the players velocity according to the keys pressed down.
	*/
	$scope.keyHandling = function (pe) {
		if (left) {
			pe[0].angle = pe[0].angle - 0.03;
		}
		if (right) {
			pe[0].angle = pe[0].angle + 0.03;
		}
		if (up) {
			pe[0].xVel = pe[0].xVel + Math.cos(pe[0].angle) * pe[0].speed;
			pe[0].yVel = pe[0].yVel + Math.sin(pe[0].angle) * pe[0].speed;
			
		}
		if (down) {
			pe[0].xVel = pe[0].xVel - Math.cos(pe[0].angle) * pe[0].speed;
			pe[0].yVel = pe[0].yVel - Math.sin(pe[0].angle) * pe[0].speed;
		}
	};
	
	/**
	* Performs all movements according to velocity and player position.
	*/
	$scope.movementHandling = function (pe, oe) {
		var index, playerAngle, direction = 1;
		//Move player entities
		for (index = 0; index < pe.length; index += 1) {
			pe[index].xPos += pe[index].xVel;
			pe[index].yPos += pe[index].yVel;
			if (index === 0) {
				pe[index].xVel *= 0.99;
				pe[index].yVel *= 0.99;
			}
		}
		//Move other entities
		for (index = 0; index < oe.length; index += 1) {
			playerAngle = Math.atan((oe[index].xPos - pe[0].xPos) / (oe[index].yPos - pe[0].yPos));
			if (oe[index].yPos >= pe[0].yPos) {
				direction = -1;
			}
			oe[index].xVel = oe[index].xVel + Math.sin(playerAngle) * oe[index].speed * direction;
			oe[index].yVel = oe[index].yVel + Math.cos(playerAngle) * oe[index].speed * direction;
			oe[index].xPos += oe[index].xVel;
			oe[index].yPos += oe[index].yVel;
			if (oe[index].speed !== 0) {
				oe[index].xVel *= 0.99;
				oe[index].yVel *= 0.99;
			}
		}
	};
	
	/**
	* Spawns any new entities if the player or an enemy is shooting.
	*/
	$scope.spawnerHandling = function (pe, oe) {
		var index, index2;
		//Only handles the players basic spawner as of now.
		pe[0].spawners[0].cooldownCounter += 1;
		if (spacebar && pe[0].spawners[0].cooldownCounter >= pe[0].spawners[0].cooldown) { //if space pressed and spawn not on cd
			$scope.spawnEntity(pe[0], pe[0].spawners[0]);
		}
		for (index = 1; index < pe.length; index += 1) {
			for (index2 = 0; index2 < pe[index].spawners.length; index2 += 1) {
				pe[index].spawners[index2].cooldownCounter += 1;
				if (pe[index].spawners[index2].cooldownCounter >= pe[index].spawners[index2].cooldown && pe[index].spawners[index2].cooldown !== -1) {
					$scope.spawnEntity(pe[index], pe[index].spawners[index2]);
				}
			}
		}
		for (index = 0; index < oe.length; index += 1) {
			for (index2 = 0; index2 < oe[index].spawners.length; index2 += 1) {
				oe[index].spawners[index2].cooldownCounter += 1;
				if (oe[index].spawners[index2].cooldownCounter >= oe[index].spawners[index2].cooldown && oe[index].spawners[index2].cooldown !== -1) {
					$scope.spawnEntity(oe[index], oe[index].spawners[index2], pe[0]);
				}
			}
		}
	};
	
	$scope.spawnEntity = function (entity, spawner, player) {
		var newSpawn, playerAngle, direction = 1;
		if (entity.type === 0) { //Player
			spawner.cooldownCounter = 0;
			newSpawn = new $scope.entity(1, entity.xPos, entity.yPos, spawner.spawnSize, spawner.spawnSize, entity.color, spawner.spawnHealth);
			newSpawn.xVel = Math.cos(entity.angle) * spawner.spawnVel;
			newSpawn.yVel = Math.sin(entity.angle) * spawner.spawnVel;
			if (spawner.speed !== undefined) {
				newSpawn.speed = spawner.speed;
			}
			$scope.map.playerEntities.push(newSpawn);
		} else if (entity.type === 3) { //all entities except player
			spawner.cooldownCounter = 0;
			playerAngle = Math.atan((entity.xPos - player.xPos) / (entity.yPos - player.yPos));
			newSpawn = new $scope.entity(3, entity.xPos, entity.yPos, spawner.spawnSize, spawner.spawnSize, entity.color, spawner.spawnHealth);
			if (entity.yPos >= player.yPos) {
				direction = -1;
			}
			newSpawn.xVel = Math.sin(spawner.spawnAngle + playerAngle) * spawner.spawnVel * direction;
			newSpawn.yVel = Math.cos(spawner.spawnAngle + playerAngle) * spawner.spawnVel * direction;
			if (spawner.speed !== undefined) {
				newSpawn.speed = spawner.speed;
			}
			newSpawn.spawners = spawner.spawnSpawners;
			$scope.map.otherEntities.push($scope.makeDifficult(newSpawn));
		}
	};
	
	/**
	* Adjusts the stats of the entity according to the current difficulty.
	*/
	$scope.makeDifficult = function (entity) {
		entity.currentHealth = Math.floor(entity.currentHealth * $scope.difficulty);
		entity.maxHealth = Math.floor(entity.maxHealth * $scope.difficulty);
		return entity;
	};
	
	$scope.boundaryHandling = function (pe, oe) {
		var index;
		//Check player collision with right and left map boundary.
		if (pe[0].xPos < 0 || pe[0].xPos > $scope.gameWidth) {
			pe[0].xVel = -pe[0].xVel * 1.2;
		}
		//Check player collision with top and bottom map boundary.
		if (pe[0].yPos < 0 || pe[0].yPos > $scope.gameHeight) {
			pe[0].yVel = -pe[0].yVel * 1.2;
		}
		//Mark any entities that wander too far off screen for deletion.
		for (index = 1; index < pe.length; index += 1) {
			//Right and left map boundary.
			if (pe[index].xPos < -200 || pe[index].xPos > $scope.gameWidth + 200) {
				$scope.onDeath(pe[index], pe[0]);
			}
			//Top and bottom map boundary
			if (pe[index].yPos < -200 || pe[index].yPos > $scope.gameHeight + 200) {
				$scope.onDeath(pe[index], pe[0]);
			}
		}
		for (index = 0; index < oe.length; index += 1) {
			//Right and left map boundary.
			if (oe[index].xPos < -300 || oe[index].xPos > $scope.gameWidth + 300) {
				$scope.onDeath(oe[index], pe[0]);
			}
			//Top and bottom map boundary
			if (oe[index].yPos < -300 || oe[index].yPos > $scope.gameHeight + 300) {
				$scope.onDeath(oe[index], pe[0]);
			}
		}
	};
	
	$scope.collisionHandling = function (pe, oe) {
		var index, index2, xDistSquared, yDistSquared, frontLeftCornerX, frontLeftCornerY, frontRightCornerX, frontRightCornerY, backLeftCornerX, backLeftCornerY, backRightCornerX, backRightCornerY;
		//Check collision between player bullets and other entities.
		for (index = 1; index < pe.length; index += 1) {
			for (index2 = 0; index2 < oe.length; index2 += 1) {
				xDistSquared = Math.pow(pe[index].xPos - oe[index2].xPos, 2);
				yDistSquared = Math.pow(pe[index].yPos - oe[index2].yPos, 2);
				if (Math.sqrt(xDistSquared + yDistSquared) < pe[index].xSize / 2 + oe[index2].xSize / 2) {
					$scope.bulletCollision(pe, oe, index, index2);
				}
			}
		}
		//Calculate the position of each corner of the player.
		frontLeftCornerX = pe[0].xPos + Math.sin(pe[0].angle) * pe[0].ySize / 2 + Math.cos(pe[0].angle) * pe[0].xSize / 2;
		frontLeftCornerY = pe[0].yPos - Math.cos(pe[0].angle) * pe[0].ySize / 2 + Math.sin(pe[0].angle) * pe[0].xSize / 2;
		frontRightCornerX = pe[0].xPos - Math.sin(pe[0].angle) * pe[0].ySize / 2 + Math.cos(pe[0].angle) * pe[0].xSize / 2;
		frontRightCornerY = pe[0].yPos + Math.cos(pe[0].angle) * pe[0].ySize / 2 + Math.sin(pe[0].angle) * pe[0].xSize / 2;
		backLeftCornerX = pe[0].xPos + Math.sin(pe[0].angle) * pe[0].ySize / 2 - Math.cos(pe[0].angle) * pe[0].xSize / 2;
		backLeftCornerY = pe[0].yPos - Math.cos(pe[0].angle) * pe[0].ySize / 2 - Math.sin(pe[0].angle) * pe[0].xSize / 2;
		backRightCornerX = pe[0].xPos - Math.sin(pe[0].angle) * pe[0].ySize / 2 - Math.cos(pe[0].angle) * pe[0].xSize / 2;
		backRightCornerY = pe[0].yPos + Math.cos(pe[0].angle) * pe[0].ySize / 2 - Math.sin(pe[0].angle) * pe[0].xSize / 2;
		//Check collision between the player and other entities.
		for (index = 0; index < oe.length; index += 1) {
			//Check if collision has occured near center of player.
			xDistSquared = Math.pow(pe[0].xPos - oe[index].xPos, 2);
			yDistSquared = Math.pow(pe[0].yPos - oe[index].yPos, 2);
			if (Math.sqrt(xDistSquared + yDistSquared) < pe[0].ySize / 2 + oe[index].xSize / 2) {
				$scope.playerCollision(pe, oe, index);
				break;
			}
			//Check if collision has occured near any of the 4 corners.
			if (Math.sqrt(Math.pow(frontLeftCornerX - oe[index].xPos, 2) + Math.pow(frontLeftCornerY - oe[index].yPos, 2)) < oe[index].xSize / 2) {
				$scope.playerCollision(pe, oe, index);
				break;
			}
			if (Math.sqrt(Math.pow(frontRightCornerX - oe[index].xPos, 2) + Math.pow(frontRightCornerY - oe[index].yPos, 2)) < oe[index].xSize / 2) {
				$scope.playerCollision(pe, oe, index);
				break;
			}
			if (Math.sqrt(Math.pow(backLeftCornerX - oe[index].xPos, 2) + Math.pow(backLeftCornerY - oe[index].yPos, 2)) < oe[index].xSize / 2) {
				$scope.playerCollision(pe, oe, index);
				break;
			}
			if (Math.sqrt(Math.pow(backRightCornerX - oe[index].xPos, 2) + Math.pow(backRightCornerY - oe[index].yPos, 2)) < oe[index].xSize / 2) {
				$scope.playerCollision(pe, oe, index);
				break;
			}
			//!!!!! TODO: Check collision with rocketengines.
		}
	};
	
	$scope.bulletCollision = function (pe, oe, index, index2) {
		if (pe[index].currentHealth > oe[index2].currentHealth + 0.0001) {
			pe[index].currentHealth -= oe[index2].currentHealth;
			$scope.onDeath(oe[index2], pe[0]);
		} else if (oe[index2].currentHealth > pe[index].currentHealth + 0.0001) {
			oe[index2].currentHealth -= pe[index].currentHealth;
			$scope.onDeath(pe[index], pe[0]);
		} else {
			$scope.onDeath(oe[index2], pe[0]);
			$scope.onDeath(pe[index], pe[0]);
		}
	};
	
	$scope.playerCollision = function (pe, oe, index) {
		//Check who has the most health to see who will die from the impact.
		if (pe[0].currentHealth > oe[index].currentHealth) {
			pe[0].currentHealth -= oe[index].currentHealth;
			$scope.onDeath(oe[index], pe[0]);
		} else {
			$scope.gameOver();
		}
			
	};
	
	$scope.onDeath = function (entity, player) {
		var index;
		//Spawn any on-death-triggered spawns
		for (index = 0; index < entity.spawners.length; index += 1) {
			if (entity.spawners[index].cooldown === -1) {
				$scope.spawnEntity(entity, entity.spawners[index], player);
			}
		}
		//Mark entity for death and delete at the end of the collision function to avoid bugs.
		entity.dead = true;
	};
	
	$scope.deletionHandling = function (pe, oe) {
		var index;
		//Delete all entities that have died during this frame.
		for (index = 1; index < pe.length; index += 1) {
			if (pe[index].dead !== undefined) {
				pe.splice(index, 1);
				index -= 1;
			}
		}
		for (index = 0; index < oe.length; index += 1) {
			if (oe[index].dead !== undefined) {
				//Also adds cash to the player right before deleting the entity
				pe[0].cash += Math.floor(oe[index].maxHealth * pe[0].dropRate);
				oe.splice(index, 1);
				index -= 1;
			}
		}
	};
	
	$scope.waveHandling = function (pe, oe) {
		//If no enemies are on the map AND no enemy is currently being spawned from json.
		if (oe.length === 0 && enemyLoading === 0) {
			if ($scope.map.currentWave.bossSpawned) {
				$scope.waveDefeated();
			} else if ($scope.map.currentWave.valueCounter >= $scope.map.currentWave.value) {
				//Spawning the boss.
				$log.info('THE BOSS HAS AWOKEN!');
				$scope.spawnFromJSON('scripts/json/astervoid-entities/' + $scope.map.currentWave.boss);
				$scope.map.currentWave.bossSpawned = true;
			} else {
				//Spawning a randomly picked enemy.
				$scope.spawnRandomEnemyFromWave();
			}
		} else if (!$scope.map.currentWave.bossSpawned && enemyLoading === 0 && $scope.map.currentWave.valueCounter <= $scope.map.currentWave.value) {
			if (Math.random() * 0.05 * $scope.map.currentWave.multiSpawnRate > Math.random() * (oe.length * oe.length + 1)) {
				$scope.spawnRandomEnemyFromWave();
			}
		}
	};
	
	$scope.spawnRandomEnemyFromWave = function () {
		var index = Math.floor(Math.random() * $scope.map.currentWave.enemies.length);
		$scope.spawnFromJSON('scripts/json/astervoid-entities/' + $scope.map.currentWave.enemies[index].enemy);
		$scope.map.currentWave.valueCounter += $scope.map.currentWave.enemies[index].value;
	};
	
	$scope.spawnFromJSON = function (path) {
		enemyLoading += 1;
		$http.get(path).success(function (data) {
			data.xPos = -70;
			data.yPos = Math.floor(Math.random() * $scope.gameHeight);
			$scope.map.otherEntities.push($scope.makeDifficult(data));
			enemyLoading -= 1;
		});
	};
	
	$scope.waveDefeated = function () {
		$log.info('YOU DEFEATED THE BOSS, CONGRATULATIONS!');
		$scope.difficulty *= 1.2;
		$scope.loadWave();
	};
	
	$scope.entity = function (type, xPos, yPos, xSize, ySize, color, maxHealth) {
		this.type = type;	// 0=player, 1=playerbullet, 2=healthpack, 3=enemy
		this.xPos = xPos;
		this.yPos = yPos;
		this.xSize = xSize;
		this.ySize = ySize;
		this.xVel = 0;
		this.yVel = 0;
		this.speed = 0;
		this.color = color;
		this.angle = 0;		//only relevant for the player entity.
		this.spawners = [];
		this.maxHealth = maxHealth;
		this.currentHealth = maxHealth;
	};
	
	$scope.spawner = function (cooldown, spawnSize, spawnAngle, spawnVel, spawnHealth, spawnSpawners) {
		this.cooldown = cooldown; // A cooldown of -1 means it will only trigger upon death.
		this.cooldownCounter = 0; //Counts up, spawner ready when number is greater or equal to cooldown.
		this.spawnSize = spawnSize;
		this.spawnAngle = spawnAngle;
		this.spawnVel = spawnVel;
		this.spawnHealth = spawnHealth; //The current health of the spawned entitiy (which is also its max health) (and damage).
		this.spawnSpawners = spawnSpawners; //Lets the spawn have spawners.
	};
	
	$scope.map = {
		color: "rgb(65,70,71)",
		playerEntities: [],
		otherEntities: [],
		currentWave: undefined
	};
	
	/**
	* Called when a key is pressed down.
	* @param e The event generated by pushing the key.
	*/
	$scope.keyDown = function (e) {
		var ek = e.keyCode;
		if (ek === 32) {
			spacebar = true;
		} else if (ek === 37) {
			left = true;
		} else if (ek === 38) {
			up = true;
		} else if (ek === 39) {
			right = true;
		} else if (ek === 40) {
			down = true;
		}
	};
	
	/**
	* Called when a key is released.
	* @param e The event generated by releasing the key.
	*/
	$scope.keyUp = function (e) {
		var ek = e.keyCode;
		if (ek === 32) {
			spacebar = false;
		} else if (ek === 37) {
			left = false;
		} else if (ek === 38) {
			up = false;
		} else if (ek === 39) {
			right = false;
		} else if (ek === 40) {
			down = false;
		}
	};
	
	$scope.gameOver = function () {
		$log.info('GAME OVER, YOU ARE DEAD');
		$scope.inGame = false;
		$scope.savePlayer($scope.map.playerEntities[0]);
	};
	
	/**
	* Loads a random wave.
	*/
	$scope.loadWave = function () {
		var index = Math.floor((Math.random() * 6) + 1);
		loadingJSON += 1;
		$http.get('scripts/json/astervoid-waves/astervoid-wave-' + index  + '.json').success(function (data) {
			$scope.map.currentWave = data;
			$log.info('Spawning wave type: ' + index);
			loadingJSON -= 1;
		});
	};
	
	$scope.resetPlayer = function () {
		loadingJSON += 1;
		$http.get('scripts/json/astervoid-entities/astervoid-player.json').success(function (data) {
			$scope.map.playerEntities[0] = data;
			$scope.loadPlayer($scope.map.playerEntities[0]);
			$scope.upgradePlayer($scope.map.playerEntities[0]);
			loadingJSON -= 1;
		});
	};
	
	$scope.upgradePlayer = function (player) {
		var index;
		player.maxHealth += player.upgrades.health;
		player.currentHealth += player.upgrades.health;
		player.healthRegen += player.upgrades.healthRegen;
		for (index = 0; index < player.spawners.length; index += 1) {
			player.spawners[index].cooldown /= player.upgrades.cooldown;
			player.spawners[index].spawnHealth += player.upgrades.damage;
		}
		player.maxMods += player.upgrades.mods;
		player.dropRate += player.upgrades.dropRate;
	};
	
	$scope.buyUpgrade = function (stat) {
		var upgradeCost = $scope.upgradeCost(stat, $scope.map.playerEntities[0]);
		if (stat === 'health' && $scope.map.playerEntities[0].cash >= upgradeCost) {
			$scope.map.playerEntities[0].cash -= upgradeCost;
			$scope.map.playerEntities[0].upgrades.health += 1;
		} else if (stat === 'healthRegen' && $scope.map.playerEntities[0].cash >= upgradeCost) {
			$scope.map.playerEntities[0].cash -= upgradeCost;
			$scope.map.playerEntities[0].upgrades.healthRegen += 1;
		} else if (stat === 'cooldown' && $scope.map.playerEntities[0].cash >= upgradeCost) {
			$scope.map.playerEntities[0].cash -= upgradeCost;
			$scope.map.playerEntities[0].upgrades.cooldown += 0.01;
		} else if (stat === 'damage' && $scope.map.playerEntities[0].cash >= upgradeCost) {
			$scope.map.playerEntities[0].cash -= upgradeCost;
			$scope.map.playerEntities[0].upgrades.damage += 1;
		} else if (stat === 'mods' && $scope.map.playerEntities[0].cash >= upgradeCost) {
			$scope.map.playerEntities[0].cash -= upgradeCost;
			$scope.map.playerEntities[0].upgrades.mods += 1;
		} else if (stat === 'dropRate' && $scope.map.playerEntities[0].cash >= upgradeCost) {
			$scope.map.playerEntities[0].cash -= upgradeCost;
			$scope.map.playerEntities[0].upgrades.dropRate += 0.01;
		}
		$scope.savePlayer($scope.map.playerEntities[0]);
		$scope.resetPlayer();
	};
	
	$scope.upgradeCost = function (stat, player) {
		if (stat === 'health') {
			return Math.floor(Math.pow(player.upgrades.health + 1, 1.5) * 10);
		} else if (stat === 'healthRegen') {
			return Math.pow(player.upgrades.healthRegen + 1, 2) * 1000;
		} else if (stat === 'cooldown') {
			return Math.floor(Math.pow(player.upgrades.cooldown - 0.99, 1.6) * 10000);
		} else if (stat === 'damage') {
			return Math.floor(Math.pow(player.upgrades.damage + 1, 1.6) * 10);
		} else if (stat === 'mods') {
			return Math.floor(Math.pow(10, player.upgrades.mods) * 1000);
		} else if (stat === 'dropRate') {
			return Math.floor(Math.pow(player.upgrades.dropRate + 1, 2) * 100);
		}
	};
	
	$scope.savePlayer = function (player) {
		//!!!!! TODO: Save player remotely at the server.
		$scope.save.cash = player.cash;
		$scope.save.upgrades = player.upgrades;
		$scope.save.equippedMods = player.equippedMods;
		$scope.save.inventoryMods = player.inventoryMods;
	};
	
	$scope.loadPlayer = function (player) {
		//!!!!! TODO: Load player remotely from the server.
		player.cash = $scope.save.cash;
		player.upgrades = $scope.save.upgrades;
		player.equippedMods = $scope.save.equippedMods;
		player.inventoryMods = $scope.save.inventoryMods;
	};
	
	$scope.save = {
		cash: 0,
		upgrades:  {
			damage: 0,
			health: 0,
			healthRegen: 0,
			cooldown: 1,
			mods: 0,
			dropRate: 0
		},
		equippedMods: [
		],
		inventoryMods: [
		]
	};
	
	$scope.startGame = function () {
		$scope.map.playerEntities.length = 0;
		$scope.map.otherEntities.length = 0;
		$scope.resetPlayer();
		$scope.loadWave();
		$scope.difficulty = 1;
		$scope.inGame = true;
	};
	
	$scope.inGame = false;
	
	$scope.difficulty = 1;
	
	/**
	* Initializes the game.
	*/
	$scope.init = function () {
		$log.info('Running astervoid in resolution: ' + $scope.gameWidth + 'x' + $scope.gameHeight);
		$scope.resetPlayer();
		before = Date.now();
		$scope.mainLoop($scope.map.playerEntities, $scope.map.otherEntities);
		$log.info('All inits done. Game starting...');
	};
	
	/**
	* Automatically called when all markup has been loaded on the page
	*/
	$timeout($scope.init);
});