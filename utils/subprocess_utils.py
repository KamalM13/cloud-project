import subprocess
import logging

def run_command(command: list):
    try:
        logging.info(f"Running command: {' '.join(command)}")
        result = subprocess.run(command, capture_output=True, text=True, check=True)
        logging.info(f"Command succeeded: {result.stdout}")
        return result.stdout
    except subprocess.CalledProcessError as e:
        logging.error(f"Command failed: {e.stderr}")
        raise RuntimeError(f"Command failed: {e.stderr}")

def run_command_background(command: list):
    logging.info(f"Running background command: {' '.join(command)}")
    subprocess.Popen(command)
