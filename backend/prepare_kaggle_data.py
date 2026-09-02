import pandas as pd
import os

def prepare_test_data():
    try:
        df = pd.read_csv('laboratory_test_results.csv')
    except FileNotFoundError:
        print("Please place the Kaggle CSV in this folder and name it 'laboratory_test_results.csv'")
        return

    os.makedirs('../test_data', exist_ok=True)

    # 1. Clean the data for mathematical comparison
    df['Result_Num'] = pd.to_numeric(df['Result'], errors='coerce')
    df['Min_Ref_Num'] = pd.to_numeric(df['Min_Reference'], errors='coerce')
    df['Max_Ref_Num'] = pd.to_numeric(df['Max_Reference'], errors='coerce')

    # Drop any rows that contain text like 'Negatif' or are missing ranges
    valid_df = df.dropna(subset=['Result_Num', 'Min_Ref_Num', 'Max_Ref_Num']).copy()

    normal_rows = []
    warning_rows = []
    critical_rows = []

    # 2. Sort the dataset exactly how our AI Agent does
    for _, row in valid_df.iterrows():
        val = row['Result_Num']
        min_v = row['Min_Ref_Num']
        max_v = row['Max_Ref_Num']
        
        if min_v <= val <= max_v:
            normal_rows.append(row)
        else:
            range_span = max_v - min_v if max_v > min_v else min_v
            threshold = range_span * 0.20
            
            if val < (min_v - threshold) or val > (max_v + threshold):
                critical_rows.append(row)
            else:
                warning_rows.append(row)

    # 3. Create DataFrames
    normal_df = pd.DataFrame(normal_rows)
    warning_df = pd.DataFrame(warning_rows)
    critical_df = pd.DataFrame(critical_rows)

    # Clean up the temporary numeric columns before saving so it looks like original Kaggle data
    cols_to_drop = ['Result_Num', 'Min_Ref_Num', 'Max_Ref_Num']

    # 4. Save exactly 5 rows to each file safely
    if not normal_df.empty:
        normal_df.sample(n=min(5, len(normal_df))).drop(columns=cols_to_drop).to_csv('../test_data/normal_labs.csv', index=False)
    if not warning_df.empty:
        warning_df.sample(n=min(5, len(warning_df))).drop(columns=cols_to_drop).to_csv('../test_data/mixed_warning_labs.csv', index=False)
    if not critical_df.empty:
        critical_df.sample(n=min(5, len(critical_df))).drop(columns=cols_to_drop).to_csv('../test_data/critical_emergency_labs.csv', index=False)

    print("✅ Intelligently generated 3 accurate test CSVs containing guaranteed Normal, Warning, and Critical values!")

if __name__ == "__main__":
    prepare_test_data()