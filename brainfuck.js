/** Interpreter variables */
// Create a new 30,000 size array, with each cell initialized with the value of 0. Memory can expand.
const MEMORY_SIZE = 30000
const memory = new Array(MEMORY_SIZE).fill(0)
// Instruction pointer (Points to the current INSTRUCTION)
let ipointer = 0
// Memory pointer (Points to a cell in MEMORY)
let mpointer = 0
// Address stack. Used to track addresses (index) of left brackets
let astack = []

let program = ''
let input = ''
let output = ''

/** Interpreter code */

function resetState() {
	// Clear memory, reset pointers to zero.
	memory.fill(0)
	ipointer = 0
	mpointer = 0
	output = ''
	input = ''
	program = ''
	astack = []
}

function sendOutput(value) {
	output += String.fromCharCode(value)
}

function getInput() {
	// Set a default value to return in case there is no input to consume
	let val = 0

	// If input isn't empty
	if (input) {
		// Get the character code of the first character of the string
		val = input.charCodeAt(0)
		// Remove the first character from the string as it is "consumed" by the program
		input = input.substring(1)
	}

	return val
}

function interpret() {
	let end = false

	while (!end) {
		switch (program[ipointer]) {
			case '>':
				if (mpointer == memory.length - 1)
					/* If we try to access memory beyond what is currently available, expand array */
					memory.push(0, 0, 0, 0, 0)
				mpointer++
				break
			case '<':
				if (mpointer > 0) mpointer--
				break
			case '+':
				memory[mpointer]++
				break
			case '-':
				memory[mpointer]--
				break
			case '.':
				sendOutput(memory[mpointer])
				break
			case ',':
				memory[mpointer] = getInput()
				break
			case '[':
				if (memory[mpointer]) {
					// If non-zero
					astack.push(ipointer)
				} else {
					// Skip to matching right bracket
					let count = 0
					while (true) {
						ipointer++
						if (!program[ipointer]) break
						if (program[ipointer] === '[') count++
						else if (program[ipointer] === ']') {
							if (count) count--
							else break
						}
					}
				}
				break
			case ']':
				//Pointer is automatically incremented every iteration, therefore we must decrement to get the correct value
				ipointer = astack.pop() - 1
				break
			case undefined: // We have reached the end of the program
				end = true
				break
			default:
				// We ignore any character that are not part of regular Brainfuck syntax
				break
		}
		ipointer++
	}
	console.log(output)
	return output
}
