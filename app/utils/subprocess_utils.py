import subprocess
import logging
import platform
import os
from typing import List, Tuple, Optional

logger = logging.getLogger(__name__)

def run_command(command: List[str]) -> Tuple[str, str, int]:
    """
    Run a shell command and return its output
    
    Args:
        command: List of command parts
        
    Returns:
        Tuple of (stdout, stderr, return_code)
    """
    logger.info(f"Running command: {' '.join(command)}")
    
    process = subprocess.Popen(
        command,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        universal_newlines=True
    )
    
    stdout, stderr = process.communicate()
    return_code = process.returncode
    
    if return_code != 0:
        logger.error(f"Command failed: {stderr}")
        raise RuntimeError(f"Command failed: {stderr}")
    
    return stdout, stderr, return_code

def run_command_background(command: List[str]) -> Optional[subprocess.Popen]:
    """
    Run a shell command in the background
    
    Args:
        command: List of command parts
        
    Returns:
        Popen process object or None
    """
    logger.info(f"Running background command: {' '.join(command)}")
    
    # Determine the appropriate DEVNULL based on the platform
    if platform.system() == "Windows":
        devnull = open(os.devnull, 'wb')
        process = subprocess.Popen(
            command,
            stdout=devnull,
            stderr=devnull,
            shell=True  # Use shell on Windows for better compatibility
        )
    else:
        process = subprocess.Popen(
            command,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
    
    return process

def check_command_exists(command: str) -> bool:
    """
    Check if a command exists in the system
    
    Args:
        command: Command name to check
        
    Returns:
        Boolean indicating if command exists
    """
    if platform.system() == "Windows":
        check_cmd = ["where", command]
    else:
        check_cmd = ["which", command]
    
    try:
        subprocess.check_call(
            check_cmd,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        return True
    except subprocess.CalledProcessError:
        return False