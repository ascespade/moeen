#!/usr/bin/env python3
"""
Tailscale Network Connection Tests
اختبارات شبكة Tailscale
Cross-platform network connectivity testing for Tailscale networks
"""

import json
import subprocess
import socket
import time
import requests
import argparse
import sys
from datetime import datetime
from typing import Dict, List, Any, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

class Colors:
    """ANSI color codes for terminal output"""
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    MAGENTA = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    BOLD = '\033[1m'
    END = '\033[0m'

class TailscaleNetworkTester:
    def __init__(self, config_file: str = "tailscale_test_config.json", verbose: bool = False):
        self.config_file = config_file
        self.verbose = verbose
        self.results = {}
        self.start_time = datetime.now()
        self.lock = threading.Lock()
        
        # Load configuration
        self.config = self.load_config()
        
    def load_config(self) -> Dict[str, Any]:
        """Load test configuration from JSON file"""
        try:
            with open(self.config_file, 'r', encoding='utf-8') as f:
                config = json.load(f)
            self.log("Configuration loaded successfully", "SUCCESS")
            return config
        except FileNotFoundError:
            self.log(f"Config file {self.config_file} not found, using defaults", "WARNING")
            return self.get_default_config()
        except json.JSONDecodeError as e:
            self.log(f"Invalid JSON in config file: {e}", "ERROR")
            return self.get_default_config()
    
    def get_default_config(self) -> Dict[str, Any]:
        """Return default configuration"""
        return {
            "machines": [
                {
                    "name": "cursor",
                    "ip": "100.87.127.117",
                    "os": "Linux",
                    "services": ["ssh", "http", "https"],
                    "ports": [22, 80, 443, 3000, 8080]
                },
                {
                    "name": "desktop-p6jvl92", 
                    "ip": "100.90.100.116",
                    "os": "Windows",
                    "services": ["ssh", "rdp", "http"],
                    "ports": [22, 80, 3389, 8080]
                },
                {
                    "name": "ec2-jump-server",
                    "ip": "100.97.57.53", 
                    "os": "Linux",
                    "services": ["ssh", "http", "https"],
                    "ports": [22, 80, 443]
                }
            ],
            "tests": {
                "basic_connectivity": True,
                "service_availability": True,
                "performance_tests": True,
                "application_tests": True
            },
            "thresholds": {
                "max_latency_ms": 200,
                "timeout_seconds": 30
            }
        }
    
    def log(self, message: str, level: str = "INFO", details: str = ""):
        """Log message with color coding"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        
        color_map = {
            "SUCCESS": Colors.GREEN,
            "ERROR": Colors.RED,
            "WARNING": Colors.YELLOW,
            "INFO": Colors.CYAN,
            "HEADER": Colors.MAGENTA
        }
        
        icon_map = {
            "SUCCESS": "✅",
            "ERROR": "❌", 
            "WARNING": "⚠️",
            "INFO": "ℹ️",
            "HEADER": "🔧"
        }
        
        color = color_map.get(level, Colors.WHITE)
        icon = icon_map.get(level, "•")
        
        print(f"{color}[{timestamp}] {icon} {message}{Colors.END}")
        
        if details and self.verbose:
            print(f"{Colors.WHITE}    📝 {details}{Colors.END}")
    
    def check_tailscale_status(self) -> Optional[Dict[str, Any]]:
        """Check if Tailscale is running and get status"""
        self.log("Checking Tailscale status...", "HEADER")
        
        try:
            result = subprocess.run(['tailscale', 'status', '--json'], 
                                  capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                status = json.loads(result.stdout)
                self.log("Tailscale is running", "SUCCESS")
                if self.verbose:
                    self.log(f"Current user: {status.get('Self', {}).get('UserID', 'Unknown')}", "INFO")
                return status
            else:
                self.log("Tailscale is not running properly", "ERROR")
                return None
        except subprocess.TimeoutExpired:
            self.log("Tailscale status check timed out", "ERROR")
            return None
        except FileNotFoundError:
            self.log("Tailscale CLI not found", "ERROR")
            return None
        except json.JSONDecodeError:
            self.log("Invalid JSON response from Tailscale", "ERROR")
            return None
    
    def ping_host(self, ip: str, count: int = 4) -> Dict[str, Any]:
        """Ping a host and return results"""
        try:
            # Use appropriate ping command based on OS
            if sys.platform.startswith('win'):
                cmd = ['ping', '-n', str(count), ip]
            else:
                cmd = ['ping', '-c', str(count), ip]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                # Parse ping output for statistics
                output = result.stdout
                if 'time=' in output or 'time<' in output:
                    return {"status": "success", "output": output}
                else:
                    return {"status": "success", "output": output}
            else:
                return {"status": "failed", "error": result.stderr}
                
        except subprocess.TimeoutExpired:
            return {"status": "timeout", "error": "Ping timed out"}
        except Exception as e:
            return {"status": "error", "error": str(e)}
    
    def test_port(self, ip: str, port: int, timeout: int = 5) -> bool:
        """Test if a port is open on a host"""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(timeout)
            result = sock.connect_ex((ip, port))
            sock.close()
            return result == 0
        except Exception:
            return False
    
    def test_http_service(self, ip: str, port: int, use_https: bool = False) -> Dict[str, Any]:
        """Test HTTP/HTTPS service availability"""
        protocol = "https" if use_https else "http"
        url = f"{protocol}://{ip}:{port}"
        
        try:
            response = requests.head(url, timeout=10, verify=False)
            return {
                "status": "success",
                "status_code": response.status_code,
                "headers": dict(response.headers)
            }
        except requests.exceptions.Timeout:
            return {"status": "timeout", "error": "Request timed out"}
        except requests.exceptions.ConnectionError:
            return {"status": "connection_error", "error": "Connection failed"}
        except Exception as e:
            return {"status": "error", "error": str(e)}
    
    def measure_latency(self, ip: str, samples: int = 5) -> Dict[str, Any]:
        """Measure network latency to a host"""
        latencies = []
        
        for _ in range(samples):
            start_time = time.time()
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(5)
                result = sock.connect_ex((ip, 22))  # Try SSH port
                sock.close()
                
                if result == 0:
                    latency = (time.time() - start_time) * 1000  # Convert to ms
                    latencies.append(latency)
            except Exception:
                continue
        
        if latencies:
            avg_latency = sum(latencies) / len(latencies)
            min_latency = min(latencies)
            max_latency = max(latencies)
            
            return {
                "status": "success",
                "average_ms": round(avg_latency, 2),
                "min_ms": round(min_latency, 2),
                "max_ms": round(max_latency, 2),
                "samples": len(latencies)
            }
        else:
            return {"status": "failed", "error": "No successful measurements"}
    
    def test_basic_connectivity(self) -> List[Dict[str, Any]]:
        """Test basic connectivity to all machines"""
        self.log("Testing basic connectivity...", "HEADER")
        results = []
        
        def test_machine_connectivity(machine):
            machine_results = {"machine": machine["name"], "ip": machine["ip"], "tests": {}}
            
            # Ping test
            self.log(f"Pinging {machine['name']} ({machine['ip']})", "INFO")
            ping_result = self.ping_host(machine["ip"])
            machine_results["tests"]["ping"] = ping_result
            
            if ping_result["status"] == "success":
                self.log(f"✅ Ping to {machine['name']} successful", "SUCCESS")
            else:
                self.log(f"❌ Ping to {machine['name']} failed", "ERROR")
            
            return machine_results
        
        # Test connectivity in parallel
        with ThreadPoolExecutor(max_workers=len(self.config["machines"])) as executor:
            futures = [executor.submit(test_machine_connectivity, machine) 
                      for machine in self.config["machines"]]
            
            for future in as_completed(futures):
                results.append(future.result())
        
        return results
    
    def test_service_availability(self) -> List[Dict[str, Any]]:
        """Test service availability on all machines"""
        self.log("Testing service availability...", "HEADER")
        results = []
        
        def test_machine_services(machine):
            machine_results = {"machine": machine["name"], "ip": machine["ip"], "services": {}}
            
            for port in machine.get("ports", []):
                self.log(f"Testing port {port} on {machine['name']}", "INFO")
                is_open = self.test_port(machine["ip"], port)
                
                machine_results["services"][str(port)] = {
                    "port": port,
                    "status": "open" if is_open else "closed"
                }
                
                if is_open:
                    self.log(f"✅ Port {port} open on {machine['name']}", "SUCCESS")
                else:
                    self.log(f"❌ Port {port} closed on {machine['name']}", "WARNING")
            
            return machine_results
        
        # Test services in parallel
        with ThreadPoolExecutor(max_workers=len(self.config["machines"])) as executor:
            futures = [executor.submit(test_machine_services, machine) 
                      for machine in self.config["machines"]]
            
            for future in as_completed(futures):
                results.append(future.result())
        
        return results
    
    def test_performance(self) -> List[Dict[str, Any]]:
        """Test network performance"""
        self.log("Testing network performance...", "HEADER")
        results = []
        
        def test_machine_performance(machine):
            machine_results = {"machine": machine["name"], "ip": machine["ip"], "performance": {}}
            
            # Latency test
            self.log(f"Measuring latency to {machine['name']}", "INFO")
            latency_result = self.measure_latency(machine["ip"])
            machine_results["performance"]["latency"] = latency_result
            
            if latency_result["status"] == "success":
                avg_latency = latency_result["average_ms"]
                self.log(f"Average latency to {machine['name']}: {avg_latency}ms", "SUCCESS")
                
                # Quality assessment
                if avg_latency < 50:
                    self.log("Excellent latency", "SUCCESS")
                elif avg_latency < 100:
                    self.log("Good latency", "SUCCESS") 
                elif avg_latency < 200:
                    self.log("Acceptable latency", "WARNING")
                else:
                    self.log("High latency - may affect performance", "WARNING")
            else:
                self.log(f"❌ Latency test failed for {machine['name']}", "ERROR")
            
            return machine_results
        
        # Test performance in parallel
        with ThreadPoolExecutor(max_workers=len(self.config["machines"])) as executor:
            futures = [executor.submit(test_machine_performance, machine) 
                      for machine in self.config["machines"]]
            
            for future in as_completed(futures):
                results.append(future.result())
        
        return results
    
    def test_application_services(self) -> List[Dict[str, Any]]:
        """Test application-specific services"""
        self.log("Testing application services...", "HEADER")
        results = []
        
        for machine in self.config["machines"]:
            machine_results = {"machine": machine["name"], "ip": machine["ip"], "applications": {}}
            
            # Test Next.js (port 3000)
            if 3000 in machine.get("ports", []):
                self.log(f"Testing Next.js on {machine['name']}", "INFO")
                http_result = self.test_http_service(machine["ip"], 3000)
                machine_results["applications"]["nextjs"] = http_result
                
                if http_result["status"] == "success":
                    self.log(f"✅ Next.js accessible on {machine['name']}", "SUCCESS")
                else:
                    self.log(f"❌ Next.js not accessible on {machine['name']}", "WARNING")
            
            # Test SSH
            if 22 in machine.get("ports", []):
                self.log(f"Testing SSH on {machine['name']}", "INFO")
                ssh_open = self.test_port(machine["ip"], 22)
                machine_results["applications"]["ssh"] = {
                    "status": "accessible" if ssh_open else "not_accessible"
                }
                
                if ssh_open:
                    self.log(f"✅ SSH accessible on {machine['name']}", "SUCCESS")
                else:
                    self.log(f"❌ SSH not accessible on {machine['name']}", "ERROR")
            
            # Test RDP (Windows machines)
            if machine.get("os") == "Windows" and 3389 in machine.get("ports", []):
                self.log(f"Testing RDP on {machine['name']}", "INFO")
                rdp_open = self.test_port(machine["ip"], 3389)
                machine_results["applications"]["rdp"] = {
                    "status": "accessible" if rdp_open else "not_accessible"
                }
                
                if rdp_open:
                    self.log(f"✅ RDP accessible on {machine['name']}", "SUCCESS")
                else:
                    self.log(f"❌ RDP not accessible on {machine['name']}", "WARNING")
            
            results.append(machine_results)
        
        return results
    
    def generate_report(self) -> Dict[str, Any]:
        """Generate comprehensive test report"""
        end_time = datetime.now()
        duration = (end_time - self.start_time).total_seconds()
        
        report = {
            "timestamp": end_time.isoformat(),
            "duration_seconds": round(duration, 2),
            "summary": {
                "total_machines": len(self.config["machines"]),
                "tests_completed": len(self.results),
                "overall_status": "completed"
            },
            "results": self.results,
            "recommendations": []
        }
        
        # Add recommendations based on results
        if "connectivity" in self.results:
            failed_pings = [r for r in self.results["connectivity"] 
                           if r["tests"]["ping"]["status"] != "success"]
            if failed_pings:
                report["recommendations"].append(
                    "Some machines are not reachable via ping. Check Tailscale connectivity."
                )
        
        if "performance" in self.results:
            high_latency = [r for r in self.results["performance"] 
                           if r["performance"]["latency"].get("average_ms", 0) > 200]
            if high_latency:
                report["recommendations"].append(
                    "High latency detected. Consider optimizing network routes or checking for issues."
                )
        
        # Save report to file
        report_filename = f"tailscale_test_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(report_filename, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        self.log(f"Test report saved to: {report_filename}", "SUCCESS")
        return report
    
    def run_all_tests(self):
        """Run all configured tests"""
        print(f"{Colors.CYAN}╔══════════════════════════════════════════════════════════════╗{Colors.END}")
        print(f"{Colors.CYAN}║                🌐 Tailscale Network Tests                    ║{Colors.END}")
        print(f"{Colors.CYAN}║              اختبارات شبكة Tailscale الشاملة                 ║{Colors.END}")
        print(f"{Colors.CYAN}╚══════════════════════════════════════════════════════════════╝{Colors.END}")
        print()
        
        # Check Tailscale status
        tailscale_status = self.check_tailscale_status()
        if not tailscale_status:
            self.log("Cannot proceed without Tailscale running", "ERROR")
            return False
        
        # Run tests based on configuration
        if self.config["tests"].get("basic_connectivity", True):
            self.results["connectivity"] = self.test_basic_connectivity()
        
        if self.config["tests"].get("service_availability", True):
            self.results["services"] = self.test_service_availability()
        
        if self.config["tests"].get("performance_tests", True):
            self.results["performance"] = self.test_performance()
        
        if self.config["tests"].get("application_tests", True):
            self.results["applications"] = self.test_application_services()
        
        # Generate report
        print()
        self.log("Generating comprehensive report...", "HEADER")
        report = self.generate_report()
        
        # Display summary
        print()
        print(f"{Colors.GREEN}╔══════════════════════════════════════════════════════════════╗{Colors.END}")
        print(f"{Colors.GREEN}║                        📊 Test Summary                       ║{Colors.END}")
        print(f"{Colors.GREEN}╚══════════════════════════════════════════════════════════════╝{Colors.END}")
        print()
        
        self.log("Tailscale Network Tests Completed!", "SUCCESS")
        self.log(f"Machines tested: {len(self.config['machines'])}", "INFO")
        self.log(f"Test duration: {report['duration_seconds']} seconds", "INFO")
        
        if report["recommendations"]:
            self.log("Recommendations:", "WARNING")
            for rec in report["recommendations"]:
                print(f"  • {rec}")
        
        print()
        self.log("All tests completed! 🚀", "SUCCESS")
        return True

def main():
    parser = argparse.ArgumentParser(description="Tailscale Network Connection Tests")
    parser.add_argument("--config", default="tailscale_test_config.json", 
                       help="Configuration file path")
    parser.add_argument("--verbose", "-v", action="store_true", 
                       help="Enable verbose output")
    
    args = parser.parse_args()
    
    # Create and run tester
    tester = TailscaleNetworkTester(config_file=args.config, verbose=args.verbose)
    success = tester.run_all_tests()
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
