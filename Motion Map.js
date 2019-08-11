/* -------------------------------------------------------------------
 *                          Motion Map V3.0
 *                           by Jack Long
 * -------------------------------------------------------------------
 */

/* -------------------------------------------------------------------
 *                         Declare Variables
 * 1. Change delta_t value to change the time interval between movement
 * 2. Change the initial position to start at different x value
 * 3. Modify velocity to simulate different speed and direction
 * 4. Change timeBetweenDot to get different motion maps.
 * -------------------------------------------------------------------
 */

let delta_t = 1/20; //unit: s
let initial_position = 0; //unit: m *Only valid at 0 - 10*
let velocity = 1; //unit: m/s
let timeBetweenDot = 1; //unit: s

/* -------------------------------------------------------------------
 *                     Write the next_x() function
 * Write the next_x function below.
 * The function takes the x-position of the dog and returns the new
 * x-position based on the velocity given.
 * -------------------------------------------------------------------
 */

function next_x(x) {
  return x + velocity * delta_t;
}
