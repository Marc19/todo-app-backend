CREATE TABLE `todo-items`.`items` (
  `item_id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(280) NOT NULL,
  `due_date` DATE NOT NULL,
  `is_completed` TINYINT NOT NULL,
  PRIMARY KEY (`item_id`));