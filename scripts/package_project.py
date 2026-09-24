import os
import zipfile
import datetime

def package_project():
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    timestamp = datetime.datetime.now().strftime("%Y%m%d")
    output_filename = f"Zero_Trust_Enterprise_Submission_{timestamp}.zip"
    
    # Exclude these directories/files from the ZIP to keep it clean and small
    exclude_dirs = {".git", "__pycache__", "node_modules", "venv", ".pytest_cache", ".venv"}
    exclude_files = {".DS_Store", output_filename}

    print(f"📦 Packaging project into {output_filename}...")
    
    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(project_root):
            # Modify dirs in-place to skip excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            for file in files:
                if file in exclude_files or file.endswith('.pyc'):
                    continue
                    
                file_path = os.path.join(root, file)
                # Calculate relative path to maintain folder structure in ZIP
                rel_path = os.path.relpath(file_path, project_root)
                
                zipf.write(file_path, rel_path)
                print(f"  + Added: {rel_path}")

    print(f"\n✅ Successfully created {output_filename}")
    print("You can submit this ZIP file for your project evaluation.")

if __name__ == "__main__":
    package_project()
